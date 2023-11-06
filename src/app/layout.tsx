import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import "./globals.css"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Web Synth App',
  description: 'Web Synth App by Tamás Petruska',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
          <div className=" bg-gray-400 w-full h-fit md:h-screen flex flex-row justify-center items-center">
            {children}
          </div>
        </body>
    </html>
  )
}
