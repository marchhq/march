import * as React from "react"

import { Metadata } from "next"
import { ThemeProvider } from "next-themes"

import { LogSnagProvider } from "@logsnag/next"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { Inter, Source_Serif_4, JetBrains_Mono } from "next/font/google"

import RightSidePopup from "../components/right-side-popup/RightSidePopup"
import { Navbar } from "@/src/components/navbar/navbar"
import { Toaster } from "@/src/components/ui/toaster"
import { AuthProvider } from "@/src/contexts/AuthContext"
// eslint-disable-next-line import/order
import classNames from "@/src/utils/classNames"

import "../styles/main.css"
import "../styles/tiptap.css"

// Fonts
const sansFont = Inter({
  variable: "--sans-font",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})

const serifFont = Source_Serif_4({
  variable: "--serif-font",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
})

const monoFont = JetBrains_Mono({
  variable: "--mono-font",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
})

// Metadata
export const metadata: Metadata = {
  title: "March",
  description: "engineered for makers",
}

// Props Interface
interface Props {
  children: React.ReactNode
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <LogSnagProvider
          token={process.env.NEXT_PUBLIC_LOGSNAG_TOKEN ?? ""}
          project={process.env.NEXT_PUBLIC_LOGSNAG_PROJECT_NAME ?? ""}
        />
      </head>
      <body
        className={classNames(
          sansFont.variable,
          serifFont.variable,
          monoFont.variable,
          "min-h-screen font-sans antialiased"
        )}
      >
        {/* Wrapping children with ThemeProvider */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <GoogleOAuthProvider
              clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ""}
            >
              <Navbar />
              {children}
              <RightSidePopup />
            </GoogleOAuthProvider>
          </AuthProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}
