const assert = require('node:assert/strict')
const { readFileSync } = require('node:fs')
const path = require('node:path')
const test = require('node:test')
const ts = require('typescript')

// Loads the worker's TypeScript (functions/) in memory, like mcp.test.cjs does
// for src/. `mocks` replaces modules by their path relative to functions/.
function workerLoader(mocks = {}) {
  const cache = new Map()
  function load(file) {
    const rel = path.relative(path.join(__dirname, '../functions'), file).replace(/\\/g, '/').replace(/\.ts$/, '')
    if (Object.hasOwn(mocks, rel)) return mocks[rel]
    if (cache.has(file)) return cache.get(file).exports
    const module = { exports: {} }
    cache.set(file, module)
    const code = ts.transpileModule(readFileSync(file, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    }).outputText
    const localRequire = (dep) => dep.startsWith('.') ? load(path.resolve(path.dirname(file), dep) + '.ts') : require(dep)
    new Function('require', 'module', 'exports', code)(localRequire, module, module.exports)
    return module.exports
  }
  return (rel) => load(path.join(__dirname, '../functions', `${rel}.ts`))
}

function fakeKV(initial = {}) {
  const data = new Map(Object.entries(initial))
  return {
    data,
    get: async (k) => (data.has(k) ? data.get(k) : null),
    put: async (k, v) => { data.set(k, String(v)) },
    delete: async (k) => { data.delete(k) },
  }
}
const ctx = (KV, extra = {}) => ({ env: { KV, ...extra } })

test('random keys are 8 chars from the URL-safe alphabet', () => {
  const { getRandomString } = workerLoader()('utils/get-random-string')
  const keys = new Set()
  for (let i = 0; i < 500; i++) {
    const key = getRandomString()
    assert.match(key, /^[A-Za-z0-9]{8}$/)
    keys.add(key)
  }
  assert.equal(keys.size, 500)
})

test('a new link never overwrites an existing key', async () => {
  const sequence = ['taken123', 'free4567']
  const load = workerLoader({ 'utils/get-random-string': { getRandomString: () => sequence.shift() } })
  const { generateQrLink } = load('lib/qr-link')
  const KV = fakeKV({ taken123: 'https://someone-else.example' })
  const key = await generateQrLink(ctx(KV), 'https://mine.example')
  assert.equal(key, 'free4567')
  assert.equal(KV.data.get('taken123'), 'https://someone-else.example')
  assert.equal(KV.data.get('free4567'), 'https://mine.example')
})

test('only http(s) destinations are stored', async () => {
  const { generateQrLink, updateQrLink } = workerLoader()('lib/qr-link')
  const KV = fakeKV({ abc: 'https://ok.example' })
  for (const bad of ['javascript:alert(1)', 'data:text/html,hi', 'ftp://x.example', 'not a url', '']) {
    await assert.rejects(generateQrLink(ctx(KV), bad), /valid HTTP or HTTPS/)
    await assert.rejects(updateQrLink(ctx(KV), 'abc', bad), /valid HTTP or HTTPS/)
  }
  assert.equal(KV.data.get('abc'), 'https://ok.example')
})

test('views go up by one when tracking is on, and stay off otherwise', async () => {
  const db = workerLoader()('lib/db')
  const KV = fakeKV({ 'views:on': '0', 'views:off': 'null' })
  assert.equal(await db.incrementViews(ctx(KV), 'on'), 1)
  assert.equal(await db.incrementViews(ctx(KV), 'on'), 2)
  assert.equal(KV.data.get('views:on'), '2')
  assert.equal(await db.incrementViews(ctx(KV), 'off'), null)
  assert.equal(await db.incrementViews(ctx(KV), 'missing'), null)
  assert.equal(KV.data.has('views:missing'), false)
})

test('the redirect counts people, not previews; unknown keys get a page', async () => {
  const app = workerLoader()('index').default
  const KV = fakeKV({ abc12345: 'https://dest.example/promo', 'views:abc12345': '0', old: 'javascript:alert(1)' })
  const waits = []
  const exec = { waitUntil: (p) => waits.push(p), passThroughOnException() {} }
  const req = (p, init = {}) => app.fetch(new Request(`https://qr.example${p}`, init), { KV, TOKEN_KEY: 'secret' }, exec)

  let res = await req('/abc12345', { headers: { 'User-Agent': 'Mozilla/5.0 (iPhone) Mobile' } })
  assert.equal(res.status, 302)
  assert.equal(res.headers.get('Location'), 'https://dest.example/promo')
  assert.equal(res.headers.get('Cache-Control'), 'no-store')
  await req('/abc12345', { headers: { 'User-Agent': 'WhatsApp/2.23' } })
  await req('/abc12345', { method: 'HEAD' })
  await Promise.all(waits)
  assert.equal(KV.data.get('views:abc12345'), '1')

  res = await req('/nope', { headers: { 'Accept-Language': 'es-PE' } })
  assert.equal(res.status, 404)
  assert.match(await res.text(), /Este código QR no existe/)
  res = await req('/old')
  assert.equal(res.status, 404)
})

test('the API needs the exact token, and nothing passes without one configured', async () => {
  const app = workerLoader()('index').default
  const KV = fakeKV({ abc12345: 'https://dest.example' })
  const call = (env, token) => app.fetch(new Request('https://qr.example/code/abc12345/info', { headers: token ? { Authorization: `Bearer ${token}` } : {} }), { KV, ...env }, { waitUntil() {}, passThroughOnException() {} })
  assert.equal((await call({ TOKEN_KEY: 'secret' }, 'wrong')).status, 401)
  assert.equal((await call({ TOKEN_KEY: 'secret' }, 'secre')).status, 401)
  assert.equal((await call({}, 'undefined')).status, 401)
  const ok = await call({ TOKEN_KEY: 'secret' }, 'secret')
  assert.equal(ok.status, 200)
  assert.equal((await ok.json()).response.destinationUrl, 'https://dest.example')
})
