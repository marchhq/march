"use client"

import React, { useEffect } from "react"

import { useThemeStore } from "../lib/store/theme.store"

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { setTheme, detectSystemTheme } = useThemeStore()

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme-storage")
    if (!storedTheme) {
      detectSystemTheme()
    } else {
      const { state } = JSON.parse(storedTheme)
      setTheme(state.theme)
    }
  }, [setTheme, detectSystemTheme])

  return <div>{children}</div>
}
