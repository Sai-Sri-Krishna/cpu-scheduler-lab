import type { Metadata, Viewport } from 'next'
import { ThemeProvider } from '@/components/theme-provider'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: 'CPU Scheduler Lab - Master CPU Scheduling Algorithms',
  description: 'Learn CPU scheduling algorithms with interactive calculators, visual simulators, and practice problems. Master FCFS, SJF, Round Robin, and Priority Scheduling.',
  keywords: ['CPU scheduling', 'operating systems', 'FCFS', 'SJF', 'Round Robin', 'Priority Scheduling', 'computer science', 'education'],
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#0f0f0f' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
      <footer className="w-full py-6 text-center border-t mt-auto">
  <p className="text-sm text-muted-foreground">
    crafted by <span className="font-semibold text-primary">VVNSSK</span>
  </p>
</footer>
    </html>
  )
}
