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
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

        const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
          const systemTheme = e.matches ? "dark" : "light"
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
        }

        mediaQuery.addEventListener("change", handleChange)

        return () => mediaQuery.removeEventListener("change", handleChange)
      },
    }),
    {
      name: "theme-storage",
    }
  )
)
