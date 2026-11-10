import 'server-only'

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'
import { z } from 'zod'
import {
  createDynamicQRForUser,
  deleteDynamicQRForUser,
  disableDynamicQRForUser,
  enableDynamicQRForUser,
  getOwnedQR,
  getPlanUsageForUser,
  listDynamicQRsForUser,
  QRQuotaError,
  QRUserError,
  qrDetails,
  updateDynamicQRUrlForUser,
} from '@/data/services/dynamic-qr-core'
import {
  generateQr,
  generateQrPng,
  getMinQrSize,
} from '@/utils/generate-qr'

const keySchema = z
  .string()
  .regex(/^[A-Za-z0-9_-]{1,128}$/)
  .describe('The dynamic QR key returned by create or list.')
const urlSchema = z
  .string()
  .min(1)
  .max(8192)
  .describe('An absolute HTTP or HTTPS destination URL.')
const formatSchema = z.enum(['svg', 'png']).default('svg')
const colorSchema = z
  .string()
  .regex(/^#(?:[\da-fA-F]{3}|[\da-fA-F]{4}|[\da-fA-F]{6}|[\da-fA-F]{8})$/)
const readOnly = {
  readOnlyHint: true,
  destructiveHint: false,
  openWorldHint: false,
}
const writes = {
  readOnlyHint: false,
  destructiveHint: false,
  openWorldHint: false,
}
const destructive = { ...writes, destructiveHint: true }

function jsonResult(data: Record<string, unknown>): CallToolResult {
  return {
    content: [{ type: 'text', text: JSON.stringify(data) }],
    structuredContent: data,
  }
}

async function toolResult(
  action: () => Promise<CallToolResult>,
): Promise<CallToolResult> {
  try {
    return await action()
  } catch (error) {
    // Only expected errors reach the client; backend details stay in logs.
    const message =
      error instanceof QRUserError
        ? error.message
        : 'QR operation failed. Please try again.'
    if (!(error instanceof QRUserError)) console.error(error)
    return {
      isError: true,
      content: [{ type: 'text', text: message }],
      structuredContent:
        error instanceof QRQuotaError
          ? { error: message, code: error.code, limit: error.limit }
          : { error: message },
    }
  }
}

/** A fresh server per request binds every tool to this key's owner. */
export function createMcpServer(uid: string) {
  const server = new McpServer({ name: 'qeeper', version: '1.0.0' })

  server.registerTool(
    'generate_static_qr',
    {
      description:
        'Generate a QR for text or a URL without storing it or using dynamic QR quota. SVG returns text; PNG returns an image.',
      inputSchema: {
        content: z.string().min(1).max(8192),
        format: formatSchema,
        size: z
          .number()
          .int()
          .min(64)
          .max(2048)
          .optional()
          .describe('Output width in pixels.'),
        margin: z
          .number()
          .min(0)
          .max(20)
          .optional()
          .describe('Quiet-zone width in QR modules.'),
        darkColor: colorSchema
          .optional()
          .describe('Dark module color as hex, e.g. #000000.'),
        lightColor: colorSchema
          .optional()
          .describe('Background color as hex, e.g. #ffffff.'),
        errorCorrectionLevel: z.enum(['L', 'M', 'Q', 'H']).optional(),
      },
      annotations: readOnly,
    },
    (input) =>
      toolResult(async () => {
        const options = {
          size: input.size,
          margin: input.margin,
          dark: input.darkColor,
          light: input.lightColor,
          errorCorrectionLevel: input.errorCorrectionLevel,
        }
        if (input.format === 'png') {
          // qrcode silently ignores a width too small for the symbol.
          if (input.size) {
            const minSize = getMinQrSize(input.content, options)
            if (input.size < minSize) {
              throw new QRUserError(
                `size must be at least ${minSize}px for this content and margin.`,
              )
            }
          }
          const dataUrl = await generateQrPng(input.content, options)
          const result = jsonResult({ format: 'png', mimeType: 'image/png' })
          result.content.push({
            type: 'image',
            mimeType: 'image/png',
            data: dataUrl.split(',')[1],
          })
          return result
        }
        return jsonResult({
          format: 'svg',
          svg: await generateQr(input.content, options),
        })
      }),
  )

  server.registerTool(
    'create_dynamic_qr',
    {
      description:
        'Create an enabled, editable short-link QR in your account. Uses both active and total plan quota. Returns its key, short URL, destination URL and SVG.',
      inputSchema: { url: urlSchema },
      annotations: writes,
    },
    ({ url }) =>
      toolResult(async () =>
        jsonResult(await createDynamicQRForUser(uid, url)),
      ),
  )

  server.registerTool(
    'list_dynamic_qrs',
    {
      description:
        'List your dynamic QRs without images. Optionally search by destination URL, short URL or key and filter by disabled status.',
      inputSchema: {
        search: z.string().max(1024).optional(),
        disabled: z.boolean().optional(),
      },
      annotations: readOnly,
    },
    ({ search, disabled }) =>
      toolResult(async () => {
        const query = search?.trim().toLowerCase() ?? ''
        const qrs = (await listDynamicQRsForUser(uid))
          .map(qrDetails)
          .filter((qr) => {
            if (disabled !== undefined && qr.disabled !== disabled) return false
            return [qr.destinationUrl, qr.shortUrl, qr.key].some((value) =>
              value.toLowerCase().includes(query),
            )
          })
        return jsonResult({ qrs })
      }),
  )

  server.registerTool(
    'get_dynamic_qr',
    {
      description:
        'Get details and a QR image for a QR owned by your account. Defaults to SVG text; PNG returns an image content block.',
      inputSchema: { key: keySchema, format: formatSchema },
      annotations: readOnly,
    },
    ({ key, format }) =>
      toolResult(async () => {
        const details = qrDetails(await getOwnedQR(key, uid))
        if (format === 'png') {
          const dataUrl = await generateQrPng(details.shortUrl)
          const result = jsonResult({
            ...details,
            format,
            mimeType: 'image/png',
          })
          result.content.push({
            type: 'image',
            mimeType: 'image/png',
            data: dataUrl.split(',')[1],
          })
          return result
        }
        return jsonResult({
          ...details,
          format,
          svg: await generateQr(details.shortUrl),
        })
      }),
  )

  server.registerTool(
    'update_dynamic_qr_url',
    {
      description:
        'Change the destination URL of one of your dynamic QRs. Disabled QRs remain disabled.',
      inputSchema: { key: keySchema, url: urlSchema },
      annotations: destructive,
    },
    ({ key, url }) =>
      toolResult(async () => {
        await updateDynamicQRUrlForUser(uid, key, url)
        return jsonResult({ key, destinationUrl: url })
      }),
  )

  server.registerTool(
    'enable_dynamic_qr',
    {
      description:
        'Enable one of your dynamic QR redirects, subject to the active QR limit for your plan.',
      inputSchema: { key: keySchema },
      annotations: writes,
    },
    ({ key }) =>
      toolResult(async () => {
        await enableDynamicQRForUser(uid, key)
        return jsonResult({ key, disabled: false })
      }),
  )

  server.registerTool(
    'disable_dynamic_qr',
    {
      description:
        'Disable one of your dynamic QR redirects and free its active slot. The QR remains stored and can be enabled again.',
      inputSchema: { key: keySchema },
      annotations: destructive,
    },
    ({ key }) =>
      toolResult(async () => {
        await disableDynamicQRForUser(uid, key)
        return jsonResult({ key, disabled: true })
      }),
  )

  server.registerTool(
    'delete_dynamic_qr',
    {
      description:
        'Permanently delete one of your dynamic QRs and its redirect. This cannot be undone.',
      inputSchema: { key: keySchema },
      annotations: destructive,
    },
    ({ key }) =>
      toolResult(async () => {
        await deleteDynamicQRForUser(uid, key)
        return jsonResult({ key, deleted: true })
      }),
  )

  server.registerTool(
    'get_plan_usage',
    {
      description:
        'Get your plan name, enabled and total dynamic QR counts, and limits. A null limit means unlimited.',
      inputSchema: {},
      annotations: readOnly,
    },
    () => toolResult(async () => jsonResult(await getPlanUsageForUser(uid))),
  )

  return server
}
