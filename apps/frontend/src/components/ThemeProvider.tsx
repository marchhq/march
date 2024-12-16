"use client"

import React, { useEffect } from "react"

import { useThemeStore } from "../lib/store/theme.store"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useThemeStore()

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      const systemTheme = e.matches ? "dark" : "light"
      setTheme(systemTheme)
    }

    handleChange(mediaQuery)

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  useEffect(() => {
    const root = window.document.documentElement
    root.setAttribute("data-theme", theme)
    root.style.colorScheme = theme
  }, [theme])

  return <div>{children}</div>
}
