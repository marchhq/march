import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Theme = "light" | "dark"

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme:
        typeof window !== "undefined"
          ? window.localStorage.getItem("theme-storage")
            ? JSON.parse(window.localStorage.getItem("theme-storage")!).state
                .theme
            : "light"
          : "light",
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "theme-storage",
    }
  )
)
