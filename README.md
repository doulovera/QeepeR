This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

using Neobrutalism components: https://www.neobrutalism.dev/

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## App language

QeepeR defaults to English and automatically uses Spanish when the browser's
preferred language is Spanish, including all `es-*` dialects such as `es-PE`,
`es-MX`, and `es-ES`. The server uses `Accept-Language` for the initial render;
the browser then checks its preferred language. The document language and page
description follow the selected language too.

To force Spanish, paste this into the browser's developer console:

```js
document.cookie = 'qeeper-locale=es; path=/; max-age=31536000; SameSite=Lax';
location.reload();
```

Use `qeeper-locale=en` in the same command to force English. The override persists
for one year in that browser. To restore automatic detection:

```js
document.cookie = 'qeeper-locale=; path=/; max-age=0; SameSite=Lax';
location.reload();
```

## MCP access

Log in, open `/qr`, expand **API keys**, and create a named key. Copy the key
immediately: plaintext is shown only once. Each account can have ten active keys;
list or revoke them in the same panel. Keys grant access only to their owner's QRs.

The MCP endpoint is `https://<host>/api/mcp`, using stateless Streamable HTTP
(JSON responses). Every request requires `Authorization: Bearer qk_live_...`.
For example, connect Claude Code with:

```bash
claude mcp add --transport http qeeper https://<host>/api/mcp --header "Authorization: Bearer qk_live_..."
```

Tools generate static SVG/PNG images, create/list/read/update/enable/disable/delete
dynamic QRs, and report plan usage. Dynamic QR tools share the web UI's ownership,
quota, and Worker/Firestore rollback logic. Unlimited limits are returned as `null`.
Existing Firebase Admin and Worker environment variables are required.

Keys are stored in Firestore `apiKeys/{sha256}` with metadata only. No composite
Firestore index is needed: account listing and the transactional active-key cap
use the default single-field `apiKeys.uid` index, then filter/sort in memory.
Keep that single-field index enabled. API-key authentication uses a direct document
lookup. `lastUsedAt` writes are scheduled after the response and throttled to once
per minute per key. Keep `apiKeys` inaccessible to client SDKs via Firestore rules;
key management goes through authenticated server actions using Firebase Admin.

Run the isolated auth, rollback, and MCP protocol checks with
`node --test tests/mcp.test.cjs` (no service credentials required).
