import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const satoshiFont = localFont({
  src: './fonts/Satoshi.woff2',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'QeepeR - QR Code Keeper',
  description:
    'QeepeR is a QR code keeper. It allows you to create, edit, and share QR codes.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={satoshiFont.className}>
      <body className="pb-10 bg-primary-100 text-black">{children}</body>
    </html>
  )
}
