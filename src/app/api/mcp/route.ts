import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js'
import { after } from 'next/server'
import { createMcpServer } from '@/data/mcp/server'
import { resolveApiKey } from '@/data/services/api-key-service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function handleRequest(request: Request) {
  const authorization = request.headers.get('authorization')
  const key = authorization?.match(/^Bearer\s+(\S+)$/i)?.[1]
  let identity: Awaited<ReturnType<typeof resolveApiKey>>
  try {
    identity = key ? await resolveApiKey(key) : null
  } catch {
    return Response.json(
      { error: 'Authentication service unavailable' },
      {
        status: 503,
        headers: { 'Cache-Control': 'no-store' },
      },
    )
  }

  if (!identity) {
    return Response.json(
      { error: 'Missing or invalid API key' },
      {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Bearer realm="qeeper", error="invalid_token"',
          'Cache-Control': 'no-store',
        },
      },
    )
  }

  // MCP requires rejecting foreign browser origins. CLI clients omit Origin.
  const origin = request.headers.get('origin')
  if (origin && origin !== new URL(request.url).origin) {
    return Response.json({ error: 'Origin not allowed' }, { status: 403 })
  }

  after(identity.touchLastUsed)

  // Stateless JSON responses need no standalone SSE stream or session deletion.
  if (request.method !== 'POST') {
    return new Response(null, { status: 405, headers: { Allow: 'POST' } })
  }

  const server = createMcpServer(identity.uid)
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  })

  try {
    await server.connect(transport)
    const response = await transport.handleRequest(request)
    response.headers.set('Cache-Control', 'no-store')
    return response
  } finally {
    // JSON mode finishes tool execution before handleRequest resolves.
    await server.close()
  }
}

export { handleRequest as POST, handleRequest as GET, handleRequest as DELETE }
