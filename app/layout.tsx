import type { Metadata } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'

// Initialize the Inter font
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GINIS Portal',
  description: 'Geographic Information Network and Infrastructure System Portal for government authorities',
  keywords: 'GINIS, GIS, Geographic Information System, Pune, District Planning Commission',
  authors: [{ name: 'District Planning Commission of Pune District' }],
  creator: 'District Planning Commission of Pune District',
  publisher: 'District Planning Commission of Pune District',
  metadataBase: new URL('https://ginis-portal.vercel.app'),
  alternates: {},
  openGraph: {
    title: 'GINIS Portal',
    description: 'Geographic Information Network and Infrastructure System Portal',
    siteName: 'GINIS Portal',
    locale: 'en_IN',
    type: 'website',
  },
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="copyright" content="© 2023-2024 District Planning Commission of Pune District. All rights reserved." />
      </head>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="light">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
