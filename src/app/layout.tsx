import type { Metadata } from "next"
import Script from "next/script"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { SessionProvider } from "next-auth/react"
import { CartProvider } from "@/contexts/cart-context"
import { auth } from "@/lib/auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ASHMARK - Premium T-Shirts",
  description: "Discover premium quality t-shirts with unique designs. Shop the latest trends at ASHMARK.",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        {/* Razorpay Script */}
        <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      </head>
      <body className={inter.className}>
        <SessionProvider session={session}>
          <CartProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem={false}
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
