"use client"

import React, { useEffect } from "react"

import { useThemeStore } from "../lib/store/theme.store"

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { setTheme, detectSystemTheme, syncWithSystemTheme } = useThemeStore()

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme-storage")
    if (storedTheme) {
      const { theme: storedUserTheme } = JSON.parse(storedTheme)
      setTheme(storedUserTheme)
    } else {
      detectSystemTheme()
    }

    const cleanupListener = syncWithSystemTheme()

    return cleanupListener
  }, [setTheme, detectSystemTheme, syncWithSystemTheme])

  return <div>{children}</div>
}
