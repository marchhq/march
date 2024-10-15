import * as React from "react"

import type { Viewport } from "next"
import NextTopLoader from "nextjs-toploader"

import { GoogleOAuthProvider } from "@react-oauth/google"
import { Inter, Source_Serif_4, JetBrains_Mono } from "next/font/google"

import "../styles/main.css"
import "../styles/tiptap.css"
import classNames from "@/src/utils/classNames"

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

export const viewport: Viewport = {
  themeColor: "#000000",
}

interface Props {
  children: React.ReactNode
}

const RootLayout: React.FC<Props> = ({ children }) => {
  return (
    <html lang="en">
      <body
        className={classNames(
          sansFont.variable,
          serifFont.variable,
          monoFont.variable,
          "overflow-x-hidden font-sans dark",
          "bg-background"
        )}
      >
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ""}
        >
          <NextTopLoader showSpinner={false} color={"#7B7B7B"} />
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  )
}

export default RootLayout
