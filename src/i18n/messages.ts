export type Locale = 'en' | 'es'

export const LOCALE_COOKIE = 'qeeper-locale'

// Match every Spanish dialect, while falling back to English for other languages.
export function detectLocale(language?: string | null): Locale {
  return /^es(?:-|_|$)/i.test(language ?? '') ? 'es' : 'en'
}

export function resolveLocale(
  override: string | undefined,
  language?: string | null,
): Locale {
  return override === 'en' || override === 'es'
    ? override
    : detectLocale(language)
}

const en = {
  description:
    'QeepeR is a QR code keeper. It allows you to create, edit, and share QR codes.',
  myQrCodes: 'My QR Codes',
  login: 'Login',
  logout: 'Log out',
  generateAnd: 'Generate &',
  edit: 'Edit',
  heroDescription:
    'Quickly generate static or dynamic QR codes, personalize their design, and update their destinations at any time.',
  fastFlexible: 'Fast. Flexible.',
  yours: 'Yours.',
  generateQr: 'Generate a QR',
  qrPreview: 'QR Preview',
  qrPlaceholder: 'Your QR code will appear here',
  samplePreview: 'Sample QR preview',
  destinationUrl: 'Destination URL',
  urlPlaceholder: 'https://your-website.com',
  urlHelp: 'Enter the URL or link you want your QR code to open.',
  invalidUrl: 'Enter a valid URL.',
  loginRequired: 'You need to log in',
  dynamicQr: 'Dynamic QR',
  dynamicHelp:
    'Dynamic QR lets you update the destination link anytime without reprinting.',
  generate: 'Generate',
  download: 'Download',
  qrList: 'Your QR List',
  listError: 'Unable to load your QR codes. Please try again.',
  alias: 'Alias:',
  disabled: 'Disabled',
  active: 'Active',
  views: 'Views',
  manageQr: 'Manage QR',
  all: 'All',
  searchByUrl: 'Search by URL',
  filterByStatus: 'Filter by status',
  noResults: 'No QR codes match your search.',
  sort: 'Sort',
  sortBy: 'Sort by',
  sortStatus: 'Status',
  sortAz: 'A → Z',
  sortZa: 'Z → A',
  confirmDisable: 'Are you sure you want to disable this QR?',
  confirmEnable: 'Are you sure you want to enable this QR?',
  confirmDelete: 'Are you sure you want to delete this QR?',
  backgroundColor: 'Background Color',
  squaresColor: 'Squares Color',
  disableLink: 'Disable Link',
  disableHelp: 'If this option is enabled, the QR will show a 404 page',
  visitorsCount: 'Visitors Count',
  visitorsHelp: 'Keep track of the number of people who visit your QR',
  delete: 'Delete',
  updateSuccess: 'Success.\nQR can take a few seconds to update.',
  updateError: 'Error',
  editDestination: 'Edit Destination URL',
  save: 'Save',
  cancel: 'Cancel',
  editableQrs: 'Your editable QRs',
  scanningAlt: 'Hand holding phone scanning a QR code',
  shareAnyone: 'Share with anyone!',
  createFailed: 'Unable to create the QR. Please try again.',
  createEnabledLimit:
    "You've reached your limit of {limit} active QRs. Disable or delete one to create another.",
  createTotalLimit:
    "You've reached the maximum of {limit} QRs for your plan. Delete one to create another.",
  enableLimit:
    "You've reached your limit of {limit} active QRs. Disable another QR first.",
  apiKeys: 'API keys',
  apiKeysHelp:
    'Connect AI clients to your QRs through MCP. Each key grants access to your account’s QR codes. Revoke keys you no longer use.',
  apiKeyName: 'Key name',
  apiKeyNamePlaceholder: 'e.g. Claude Code',
  apiKeyCreate: 'Create key',
  apiKeyOnce: 'Copy this key now. It will only be shown once.',
  apiKeyCopy: 'Copy key',
  apiKeyCopied: 'Copied',
  apiKeyDismiss: 'Done',
  apiKeyRefresh: 'Refresh keys',
  apiKeyEmpty: 'No API keys yet.',
  apiKeyCreated: 'Created',
  apiKeyLastUsed: 'Last used',
  apiKeyNever: 'Never',
  apiKeyRevoke: 'Revoke',
  apiKeyRevoked: 'Revoked',
  apiKeyConfirmRevoke:
    'Revoke this API key? Clients using it will immediately lose access.',
  apiKeyLimit:
    'You can have up to 10 active API keys. Revoke one to create another.',
  apiKeyInvalidName: 'Enter a key name between 1 and 80 characters.',
  apiKeyError: 'Unable to update API keys. Please try again.',
  apiKeyLoadError: 'Unable to load API keys. Use Refresh keys to try again.',
  apiKeyCopyError: 'Unable to copy. Select the key and copy it manually.',
}

export type MessageKey = keyof typeof en

const es: Record<MessageKey, string> = {
  description: 'QeepeR te permite crear, editar y compartir códigos QR.',
  myQrCodes: 'Mis códigos QR',
  login: 'Iniciar sesión',
  logout: 'Cerrar sesión',
  generateAnd: 'Genera y',
  edit: 'Edita',
  heroDescription:
    'Genera códigos QR estáticos o dinámicos en segundos, personaliza su diseño y cambia su destino cuando quieras.',
  fastFlexible: 'Rápido. Flexible.',
  yours: 'Tuyo.',
  generateQr: 'Genera un QR',
  qrPreview: 'Vista previa del QR',
  qrPlaceholder: 'Tu código QR aparecerá aquí',
  samplePreview: 'Vista previa de un QR de ejemplo',
  destinationUrl: 'URL de destino',
  urlPlaceholder: 'https://tu-sitio-web.com',
  urlHelp: 'Ingresa la URL o el enlace que quieres abrir con tu código QR.',
  invalidUrl: 'Ingresa una URL válida.',
  loginRequired: 'Debes iniciar sesión',
  dynamicQr: 'QR dinámico',
  dynamicHelp:
    'Un QR dinámico te permite cambiar el enlace de destino cuando quieras sin volver a imprimirlo.',
  generate: 'Generar',
  download: 'Descargar',
  qrList: 'Tus códigos QR',
  listError: 'No se pudieron cargar tus códigos QR. Inténtalo de nuevo.',
  alias: 'Alias:',
  disabled: 'Desactivado',
  active: 'Activo',
  views: 'Visitas',
  manageQr: 'Administrar QR',
  all: 'Todos',
  searchByUrl: 'Buscar por URL',
  filterByStatus: 'Filtrar por estado',
  noResults: 'Ningún código QR coincide con tu búsqueda.',
  sort: 'Ordenar',
  sortBy: 'Ordenar por',
  sortStatus: 'Estado',
  sortAz: 'A → Z',
  sortZa: 'Z → A',
  confirmDisable: '¿Seguro que quieres desactivar este QR?',
  confirmEnable: '¿Seguro que quieres activar este QR?',
  confirmDelete: '¿Seguro que quieres eliminar este QR?',
  backgroundColor: 'Color de fondo',
  squaresColor: 'Color de los cuadrados',
  disableLink: 'Desactivar enlace',
  disableHelp: 'Si activas esta opción, el QR mostrará una página de error 404',
  visitorsCount: 'Número de visitas',
  visitorsHelp: 'Lleva la cuenta de las personas que visitan tu QR',
  delete: 'Eliminar',
  updateSuccess: 'Listo.\nEl QR puede tardar unos segundos en actualizarse.',
  updateError: 'Error',
  editDestination: 'Editar URL de destino',
  save: 'Guardar',
  cancel: 'Cancelar',
  editableQrs: 'Tus QR editables',
  scanningAlt: 'Una mano sostiene un teléfono que escanea un código QR',
  shareAnyone: '¡Compártelo con quien quieras!',
  createFailed: 'No se pudo crear el QR. Inténtalo de nuevo.',
  createEnabledLimit:
    'Alcanzaste tu límite de {limit} QR activos. Desactiva o elimina uno para crear otro.',
  createTotalLimit:
    'Alcanzaste el máximo de {limit} QR de tu plan. Elimina uno para crear otro.',
  enableLimit:
    'Alcanzaste tu límite de {limit} QR activos. Desactiva otro QR primero.',
  apiKeys: 'Claves de API',
  apiKeysHelp:
    'Conecta clientes de IA a tus QR mediante MCP. Cada clave da acceso a los códigos QR de tu cuenta. Revoca las claves que ya no uses.',
  apiKeyName: 'Nombre de la clave',
  apiKeyNamePlaceholder: 'p. ej. Claude Code',
  apiKeyCreate: 'Crear clave',
  apiKeyOnce: 'Copia esta clave ahora. Solo se mostrará una vez.',
  apiKeyCopy: 'Copiar clave',
  apiKeyCopied: 'Copiada',
  apiKeyDismiss: 'Listo',
  apiKeyRefresh: 'Actualizar claves',
  apiKeyEmpty: 'Aún no hay claves de API.',
  apiKeyCreated: 'Creada',
  apiKeyLastUsed: 'Último uso',
  apiKeyNever: 'Nunca',
  apiKeyRevoke: 'Revocar',
  apiKeyRevoked: 'Revocada',
  apiKeyConfirmRevoke:
    '¿Revocar esta clave de API? Los clientes que la usan perderán el acceso inmediatamente.',
  apiKeyLimit:
    'Puedes tener hasta 10 claves de API activas. Revoca una para crear otra.',
  apiKeyInvalidName: 'Ingresa un nombre de entre 1 y 80 caracteres.',
  apiKeyError:
    'No se pudieron actualizar las claves de API. Inténtalo de nuevo.',
  apiKeyLoadError:
    'No se pudieron cargar las claves de API. Usa Actualizar claves para volver a intentarlo.',
  apiKeyCopyError:
    'No se pudo copiar. Selecciona la clave y cópiala manualmente.',
}

export const messages = { en, es }
