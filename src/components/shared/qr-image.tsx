import { Card } from '../ui/card'

interface Props {
  svg: string
  className?: string
}
export const QrImage = ({ svg, className }: Props) => {
  return (
    <Card shadow={false} className={className}>
      {svg ? (
        <div
          data-qr-preview
          className="aspect-square h-full w-full"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: svg is sanitized
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : (
        <div
          data-qr-preview
          aria-label="Sample QR preview"
          className="aspect-square h-full w-full bg-white p-4"
        >
          <div className="grid h-full w-full grid-cols-11 grid-rows-11 gap-1">
            {Array.from({ length: 121 }, (_, cell) => {
              const row = Math.floor(cell / 11)
              const col = cell % 11
              const finder =
                (row < 4 && col < 4) ||
                (row < 4 && col > 6) ||
                (row > 6 && col < 4)
              const innerFinder =
                (row === 1 || row === 2 || row === 8 || row === 9) &&
                (col === 1 || col === 2 || col === 8 || col === 9)
              const modules = new Set([
                5, 17, 25, 38, 41, 45, 50, 52, 57, 61, 63, 67, 69, 73, 78,
                82, 86, 91, 95, 101, 104, 109, 113, 118,
              ])
              const filled = finder || innerFinder || modules.has(cell)

              return (
                <span
                  key={`qr-cell-${row}-${col}`}
                  className={filled ? 'bg-black' : 'bg-transparent'}
                />
              )
            })}
          </div>
        </div>
      )}
    </Card>
  )
}
