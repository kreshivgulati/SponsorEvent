import './globals.css'
import { Inter } from 'next/font/google'
import AuthGuard from "./AuthGuard"

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'SponsorMatch - Connect Events with Sponsors',
  description: 'Platform connecting event organizers with sponsors',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          src="https://accounts.google.com/gsi/client"
          async
          defer
        ></script>
      </head>
      <body className={inter.className}>
        {/* ✅ AUTH GUARD APPLIED HERE */}
        <AuthGuard>
          {children}
        </AuthGuard>
      </body>
    </html>
  )
}
