import { create } from "zustand"
import { persist } from "zustand/middleware"

type Theme = "light" | "dark"

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
  detectSystemTheme: () => void
  syncWithSystemTheme: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "light",
      setTheme: (theme) => {
        set({ theme })
        const root = window.document.documentElement
        root.setAttribute("data-theme", theme)
        if (theme === "dark") {
          root.classList.add("dark")
        } else {
          root.classList.remove("dark")
        }
        localStorage.setItem("theme-storage", JSON.stringify({ theme }))
      },
      detectSystemTheme: () => {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light"
        set({ theme: systemTheme })
        const root = window.document.documentElement
        root.setAttribute("data-theme", systemTheme)
        if (systemTheme === "dark") {
          root.classList.add("dark")
        } else {
          root.classList.remove("dark")
        }
        localStorage.setItem(
          "theme-storage",
          JSON.stringify({ theme: systemTheme })
        )
      },
      syncWithSystemTheme: () => {
        // Disable system theme sync to maintain light theme as default
        return () => {}
      },
    }),
    {
      name: "theme-storage",
    }
  )
)
