const assert = require('node:assert/strict')
const { createHash } = require('node:crypto')
const { readFileSync } = require('node:fs')
const path = require('node:path')
const test = require('node:test')
const ts = require('typescript')
const { Timestamp } = require('firebase-admin/firestore')

// Load the actual TypeScript in memory with infrastructure doubles. No Next
// server, build artifacts, credentials, network calls or extra test deps needed.
function sourceLoader(mocks = {}) {
  const cache = new Map()
  function load(name) {
    if (Object.hasOwn(mocks, name)) return mocks[name]
    if (name === 'server-only') return {}
    if (!name.startsWith('@/')) return require(name)
    const filename = path.join(__dirname, '../src', `${name.slice(2)}.ts`)
    if (cache.has(filename)) return cache.get(filename).exports
    const module = { exports: {} }
    cache.set(filename, module)
    const code = ts.transpileModule(readFileSync(filename, 'utf8'), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        esModuleInterop: true,
      },
    }).outputText
    const localRequire = (dependency) =>
      dependency.startsWith('.')
        ? load(
            `@/${path.relative(path.join(__dirname, '../src'), path.resolve(path.dirname(filename), dependency))}`,
          )
        : load(dependency)
    new Function('require', 'module', 'exports', code)(
      localRequire,
      module,
      module.exports,
    )
    return module.exports
  }
  return load
}

function keyFixture() {
  const docs = new Map()
  let writes = 0
  let queue = Promise.resolve()
  const snapshot = (id) => ({
    id: id.split('/').at(-1),
    data: () => docs.get(id),
  })
  const db = {
    collection(name) {
      return {
        doc(id) {
          return {
            id: `${name}/${id}`,
            get: async () => snapshot(`${name}/${id}`),
          }
        },
        where(field, op, value) {
          assert.equal(op, '==')
          return {
            get: async () => ({
              docs: [...docs.keys()]
                .filter(
                  (id) =>
                    id.startsWith(`${name}/`) && docs.get(id)[field] === value,
                )
                .map(snapshot),
            }),
          }
        },
      }
    },
    runTransaction(action) {
      const result = queue.then(() =>
        action({
          get: (ref) => ref.get(),
          create(ref, data) {
            assert.equal(docs.has(ref.id), false)
            docs.set(ref.id, data)
          },
          set(ref, data) {
            docs.set(ref.id, { ...docs.get(ref.id), ...data })
          },
          update(ref, data) {
            writes++
            docs.set(ref.id, { ...docs.get(ref.id), ...data })
          },
        }),
      )
      queue = result.catch(() => {})
      return result
    },
  }
  const load = sourceLoader({ '@/lib/firebase/admin': { _db: db } })
  return {
    service: load('@/data/services/api-key-service'),
    docs,
    writes: () => writes,
    load,
  }
}

function qrFixture() {
  const events = []
  const records = new Map()
  const worker = new Map()
  const state = {
    plan: 'free',
    failSave: false,
    failUpdate: false,
    failDisabled: false,
    failDelete: false,
    quota: { ok: true },
  }
  let nextKey = 0
  const qr = (key, owner = 'alice', disabled = false) => {
    const data = {
      alias: key,
      userId: owner,
      destinationUrl: 'https://old.example',
      disabled,
      createdAt: Timestamp.now(),
      views: null,
    }
    records.set(key, data)
    if (!disabled) worker.set(key, data.destinationUrl)
    return data
  }
  const load = sourceLoader({
    '@/utils/get-worker-url': {
      getWorkerUrl: (key) => `https://qr.example/${key}`,
    },
    '@/data/models/Users': { User: { getPlan: async () => state.plan } },
    '@/data/services/get-user-me-service': {
      getUserMe: async () => ({ uid: 'alice' }),
    },
    '@/data/models/QRs': {
      QRs: {
        countByUser: async (uid) => ({
          total: [...records.values()].filter((qr) => qr.userId === uid).length,
          enabled: [...records.values()].filter(
            (qr) => qr.userId === uid && !qr.disabled,
          ).length,
        }),
      },
    },
    '@/data/services/quota-service': {
      checkCanCreateQR: async () => state.quota,
      checkCanEnableQR: async () => state.quota,
      getPlanLimits: async () => ({ enabled: 5, total: 10 }),
    },
    '@/data/services/qr-db-service': {
      getOneQRInDB: async (key) => records.get(key),
      listUserQrs: async () => [...records.values()], // includes stale foreign index entries
      addQR: async (key, { url, uid }) => {
        events.push('save')
        if (state.failSave) return undefined
        const data = {
          alias: key,
          userId: uid,
          destinationUrl: url,
          disabled: false,
          createdAt: Timestamp.now(),
          views: null,
        }
        records.set(key, data)
        return data
      },
      updateQRUrlInDB: async (key, url) => {
        events.push('db-url')
        if (state.failUpdate) return false
        records.get(key).destinationUrl = url
        return true
      },
      updateDisableQRInDB: async (key, value) => {
        events.push('db-disabled')
        if (state.failDisabled) return false
        records.get(key).disabled = value
        return true
      },
      deleteQRInDB: async (key) => {
        events.push('db-delete')
        return state.failDelete ? false : records.delete(key)
      },
    },
    '@/data/services/qr-object-service': {
      createWorkerQR: async (url, override) => {
        events.push('worker-create')
        const key = override?.key ?? `qr${++nextKey}`
        worker.set(key, url)
        return { key, url: `https://qr.example/${key}` }
      },
      deleteWorkerQR: async (key) => {
        events.push('worker-delete')
        return worker.delete(key) ? 'deleted' : 'missing'
      },
      updateUrlWorkerQR: async (key, url) => {
        events.push('worker-url')
        worker.set(key, url)
        return true
      },
    },
  })
  return {
    core: load('@/data/services/dynamic-qr-core'),
    load,
    qr,
    state,
    records,
    worker,
    events,
  }
}

test('API keys store only a hash and display metadata, scoped by owner', async () => {
  const f = keyFixture()
  const created = await f.service.createApiKeyForUser('alice', ' Claude ')
  assert.match(created.key, /^qk_live_[A-Za-z0-9_-]{43}$/)
  const hash = createHash('sha256').update(created.key).digest('hex')
  assert.equal(created.metadata.id, hash)
  const stored = f.docs.get(`/apiKeys/${hash}`)
  assert.equal(stored.hash, hash)
  assert.equal(stored.name, 'Claude')
  assert.equal(JSON.stringify(stored).includes(created.key), false)
  assert.equal('hash' in created.metadata, false)
  assert.equal((await f.service.listApiKeysForUser('alice')).length, 1)
  assert.deepEqual(await f.service.listApiKeysForUser('bob'), [])
  await assert.rejects(f.service.revokeApiKeyForUser('bob', hash), /not_found/)
  assert.equal((await f.service.resolveApiKey(created.key)).uid, 'alice')
  await f.service.revokeApiKeyForUser('alice', hash)
  assert.equal(await f.service.resolveApiKey(created.key), null)
  assert.equal(await f.service.resolveApiKey('qk_live_invalid'), null)
})

test('concurrent key creation respects the active cap; revocation frees a slot', async () => {
  const f = keyFixture()
  const results = await Promise.allSettled(
    Array.from({ length: 12 }, (_, i) =>
      f.service.createApiKeyForUser('alice', `key ${i}`),
    ),
  )
  assert.equal(results.filter((r) => r.status === 'fulfilled').length, 10)
  assert.equal(
    results.filter(
      (r) => r.status === 'rejected' && r.reason.code === 'key_limit',
    ).length,
    2,
  )
  await f.service.revokeApiKeyForUser('alice', results[0].value.metadata.id)
  await f.service.createApiKeyForUser('alice', 'replacement')
})

test('last-used writes are throttled, and deferred touches cannot revive a revoked key', async () => {
  const f = keyFixture()
  const { key, metadata } = await f.service.createApiKeyForUser(
    'alice',
    'client',
  )
  const first = await f.service.resolveApiKey(key)
  const second = await f.service.resolveApiKey(key)
  assert.equal(f.writes(), 0)
  await Promise.all([first.touchLastUsed(), second.touchLastUsed()])
  assert.equal(f.writes(), 1)
  await (await f.service.resolveApiKey(key)).touchLastUsed()
  assert.equal(f.writes(), 1)
  f.docs.get(`/apiKeys/${metadata.id}`).lastUsedAt = Timestamp.fromMillis(
    Date.now() - 61_000,
  )
  const stale = await f.service.resolveApiKey(key)
  await f.service.revokeApiKeyForUser('alice', metadata.id)
  const writesBefore = f.writes()
  await stale.touchLastUsed()
  assert.equal(f.writes(), writesBefore)
})

test('cookie actions reject anonymous key management', async () => {
  const actions = sourceLoader({
    '@/data/services/get-user-me-service': { getUserMe: async () => null },
    '@/data/services/api-key-service': {},
  })('@/data/actions/api-key-actions')
  for (const result of await Promise.all([
    actions.createApiKey('name'),
    actions.listApiKeys(),
    actions.revokeApiKey('id'),
  ])) {
    assert.deepEqual(result, { ok: false, error: 'unauthorized' })
  }
})

test('core rejects foreign-account operations and unsafe URLs before worker writes', async () => {
  const f = qrFixture()
  f.qr('foreign', 'bob')
  for (const operation of [
    () => f.core.getOwnedQR('foreign', 'alice'),
    () =>
      f.core.updateDynamicQRUrlForUser(
        'alice',
        'foreign',
        'https://new.example',
      ),
    () => f.core.enableDynamicQRForUser('alice', 'foreign'),
    () => f.core.disableDynamicQRForUser('alice', 'foreign'),
    () => f.core.deleteDynamicQRForUser('alice', 'foreign'),
  ])
    await assert.rejects(operation(), /unauthorized/)
  for (const url of [
    'javascript:alert(1)',
    'ftp://example.com',
    'data:text/plain,test',
    'bad',
  ]) {
    await assert.rejects(
      f.core.createDynamicQRForUser('alice', url),
      /HTTP or HTTPS/,
    )
    await assert.rejects(
      f.core.updateDynamicQRUrlForUser('alice', 'foreign', url),
      /HTTP or HTTPS/,
    )
  }
  assert.deepEqual(f.events, [])
  assert.deepEqual(await f.core.listDynamicQRsForUser('alice'), [])
})

test('create rollback deletes the worker link when Firestore save fails', async () => {
  const f = qrFixture()
  f.state.failSave = true
  await assert.rejects(
    f.core.createDynamicQRForUser('alice', 'https://new.example'),
    /save QR/,
  )
  assert.deepEqual(f.events, ['worker-create', 'save', 'worker-delete'])
  assert.equal(f.worker.size, 0)
})

test('URL update rollback restores the old active destination; disabled QR skips worker', async () => {
  const f = qrFixture()
  f.qr('owned')
  f.state.failUpdate = true
  await assert.rejects(
    f.core.updateDynamicQRUrlForUser('alice', 'owned', 'https://new.example'),
  )
  assert.deepEqual(f.events, ['worker-url', 'db-url', 'worker-url'])
  assert.equal(f.worker.get('owned'), 'https://old.example')
  f.events.length = 0
  f.qr('disabled', 'alice', true)
  f.state.failUpdate = false
  await f.core.updateDynamicQRUrlForUser(
    'alice',
    'disabled',
    'http://new.example',
  )
  assert.deepEqual(f.events, ['db-url'])
})

test('disable/delete rollback restores existing links but never restores missing ones', async () => {
  for (const operation of ['disable', 'delete']) {
    for (const exists of [true, false]) {
      const f = qrFixture()
      f.qr('owned')
      if (!exists) f.worker.delete('owned')
      f.state[operation === 'disable' ? 'failDisabled' : 'failDelete'] = true
      await assert.rejects(
        f.core[
          operation === 'disable'
            ? 'disableDynamicQRForUser'
            : 'deleteDynamicQRForUser'
        ]('alice', 'owned'),
      )
      assert.deepEqual(f.events, [
        'worker-delete',
        operation === 'disable' ? 'db-disabled' : 'db-delete',
        ...(exists ? ['worker-create'] : []),
      ])
      assert.equal(f.worker.has('owned'), exists)
    }
  }
})

test('enable rollback removes a new link; quota rejection never touches worker', async () => {
  const f = qrFixture()
  f.qr('disabled', 'alice', true)
  f.state.failDisabled = true
  await assert.rejects(f.core.enableDynamicQRForUser('alice', 'disabled'))
  assert.deepEqual(f.events, ['worker-create', 'db-disabled', 'worker-delete'])
  f.events.length = 0
  f.state.quota = { ok: false, error: 'enabled_limit', limit: 5 }
  await assert.rejects(
    f.core.enableDynamicQRForUser('alice', 'disabled'),
    /limit reached \(5\)/,
  )
  await assert.rejects(
    f.core.createDynamicQRForUser('alice', 'https://new.example'),
    /limit reached \(5\)/,
  )
  assert.deepEqual(f.events, [])
})

function routeFixture() {
  const f = qrFixture()
  const deferred = []
  const route = sourceLoader({
    '@/data/mcp/server': f.load('@/data/mcp/server'),
    '@/data/services/api-key-service': {
      resolveApiKey: async (key) =>
        key === 'valid'
          ? { uid: 'alice', touchLastUsed: async () => {} }
          : null,
    },
    'next/server': { after: (callback) => deferred.push(callback) },
  })('@/app/api/mcp/route')
  async function request(
    method,
    params = {},
    headers = {},
    httpMethod = 'POST',
  ) {
    return route.POST(
      new Request('https://app.example/api/mcp', {
        method: httpMethod,
        headers: {
          authorization: 'Bearer valid',
          accept: 'application/json, text/event-stream',
          'content-type': 'application/json',
          ...headers,
        },
        ...(httpMethod === 'POST'
          ? { body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }) }
          : {}),
      }),
    )
  }
  async function call(name, args = {}) {
    const response = await request('tools/call', { name, arguments: args })
    assert.equal(response.status, 200)
    assert.equal(response.headers.get('mcp-session-id'), null)
    assert.equal(response.headers.get('cache-control'), 'no-store')
    const body = await response.json()
    assert.equal(body.error, undefined, JSON.stringify(body))
    return body.result
  }
  return { ...f, request, call, deferred }
}

test('HTTP auth requires bearer keys, rejects foreign origins and uses no sessions', async () => {
  const f = routeFixture()
  for (const authorization of ['', 'Bearer revoked', 'Basic valid']) {
    const response = await f.request('tools/list', {}, { authorization })
    assert.equal(response.status, 401)
    assert.match(response.headers.get('www-authenticate'), /^Bearer /)
  }
  assert.equal(
    (await f.request('tools/list', {}, { origin: 'https://evil.example' }))
      .status,
    403,
  )
  assert.equal((await f.request('tools/list', {}, {}, 'GET')).status, 405)
  assert.equal((await f.request('tools/list', {}, {}, 'DELETE')).status, 405)
  const initialized = await f.request('initialize', {
    protocolVersion: '2025-11-25',
    capabilities: {},
    clientInfo: { name: 'test', version: '1' },
  })
  assert.equal(initialized.status, 200)
  assert.equal(initialized.headers.get('mcp-session-id'), null)
  const response = await f.request('tools/list')
  const { result } = await response.json()
  assert.equal(result.tools.length, 9)
  assert.equal(
    result.tools.find((t) => t.name === 'delete_dynamic_qr').annotations
      .destructiveHint,
    true,
  )
  assert.equal(
    result.tools.find((t) => t.name === 'list_dynamic_qrs').annotations
      .readOnlyHint,
    true,
  )
  assert.ok(f.deferred.length > 0)
})

test('MCP generates SVG/real PNG images, filters image-free lists and rejects invalid inputs', async () => {
  const f = routeFixture()
  const svg = await f.call('generate_static_qr', { content: 'hello' })
  assert.match(svg.structuredContent.svg, /<svg/)
  const png = await f.call('generate_static_qr', {
    content: 'hello',
    format: 'png',
    size: 256,
  })
  const bytes = Buffer.from(
    png.content.find((c) => c.type === 'image').data,
    'base64',
  )
  assert.equal(bytes.subarray(1, 4).toString(), 'PNG')
  assert.equal(bytes.readUInt32BE(16), 256)
  assert.equal(
    (await f.call('generate_static_qr', { content: 'hello', size: 100000 }))
      .isError,
    true,
  )
  f.qr('owned')
  f.qr('disabled', 'alice', true)
  f.qr('foreign', 'bob')
  const listed = await f.call('list_dynamic_qrs', {
    disabled: true,
    search: 'OLD.EXAMPLE',
  })
  assert.deepEqual(
    listed.structuredContent.qrs.map((qr) => qr.key),
    ['disabled'],
  )
  assert.equal('svg' in listed.structuredContent.qrs[0], false)
  assert.equal(
    (await f.call('get_dynamic_qr', { key: 'foreign' })).isError,
    true,
  )
  const owned = await f.call('get_dynamic_qr', { key: 'owned', format: 'png' })
  assert.equal(owned.structuredContent.destinationUrl, 'https://old.example')
  assert.equal(
    owned.content.some((c) => c.type === 'image'),
    true,
  )
})

test('MCP binds mutations to the authenticated account and reports readable quota errors', async () => {
  const f = routeFixture()
  const created = await f.call('create_dynamic_qr', {
    url: 'https://new.example',
    uid: 'bob',
  })
  const key = created.structuredContent.key
  assert.equal(f.records.get(key).userId, 'alice')
  await f.call('update_dynamic_qr_url', { key, url: 'https://updated.example' })
  assert.equal(f.records.get(key).destinationUrl, 'https://updated.example')
  await f.call('disable_dynamic_qr', { key })
  assert.equal(f.records.get(key).disabled, true)
  f.state.quota = { ok: false, error: 'enabled_limit', limit: 5 }
  const quota = await f.call('enable_dynamic_qr', { key })
  assert.equal(quota.isError, true)
  assert.equal(quota.structuredContent.limit, 5)
  assert.match(quota.content[0].text, /limit reached \(5\)/)
  f.state.quota = { ok: true }
  await f.call('enable_dynamic_qr', { key })
  const usage = await f.call('get_plan_usage')
  assert.deepEqual(usage.structuredContent, {
    plan: 'free',
    enabled: 1,
    total: 1,
    limits: { enabled: 5, total: 10 },
  })
  await f.call('delete_dynamic_qr', { key })
  assert.equal(f.records.has(key), false)
  assert.equal(f.worker.has(key), false)
})

test('web actions preserve SVG, list, boolean and quota-result contracts', async () => {
  const f = qrFixture()
  const actions = f.load('@/data/actions/dynamic-code-actions')
  const created = await actions.createDynamicQR('https://new.example')
  assert.equal(created.ok, true)
  assert.match(created.data, /<svg/)
  const list = await actions.listDynamicQRs()
  assert.equal(list[0].destinationUrl, 'https://new.example')
  assert.equal(typeof list[0].createdAt, 'string')
  assert.match(list[0].svg, /<svg/)
  assert.equal(await actions.getActiveQrLimit(), 5)
  assert.equal(await actions.disableDynamicQR(list[0].alias), true)
  f.state.quota = { ok: false, error: 'enabled_limit', limit: 5 }
  assert.deepEqual(await actions.enableDynamicQR(list[0].alias), {
    ok: false,
    error: 'enabled_limit',
    limit: 5,
  })
  assert.deepEqual(await actions.createDynamicQR('https://new.example'), {
    ok: false,
    error: 'enabled_limit',
    limit: 5,
  })
  f.state.quota = { ok: true }
  assert.deepEqual(await actions.enableDynamicQR(list[0].alias), {
    ok: true,
    data: null,
  })
  assert.equal(
    await actions.updateUrlDynamicQR(list[0].alias, 'https://updated.example'),
    true,
  )
  assert.equal(await actions.deleteDynamicQR(list[0].alias), true)
})

test('unlimited plan usage returns JSON nulls for both limits', async () => {
  const f = routeFixture()
  f.state.plan = 'unlimited'
  const result = await f.call('get_plan_usage')
  assert.deepEqual(result.structuredContent.limits, {
    enabled: null,
    total: null,
  })
})
