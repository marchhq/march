import { create } from "zustand"
import { persist } from "zustand/middleware"

type Theme = "light" | "dark"

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
  detectSystemTheme: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "dark",
      setTheme: (theme) => {
        set({ theme })
        const root = window.document.documentElement
        root.setAttribute("data-theme", theme)
        if (theme === "dark") {
          root.classList.add("dark")
        } else {
          root.classList.remove("dark")
        }
      },
      detectSystemTheme: () => {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light"
        set({ theme: systemTheme })
      },
    }),
    {
      name: "theme-storage",
    }
  )
)
