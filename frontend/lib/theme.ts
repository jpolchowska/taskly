export const ACCENT_COLORS = ["#8B7FD6", "#87A878", "#6C9BC7", "#C97B63"] as const;

export type AccentColor = (typeof ACCENT_COLORS)[number];
export type Theme = "light" | "dark";

export const DEFAULT_ACCENT: AccentColor = ACCENT_COLORS[0];

export const THEME_STORAGE_KEY = "taskly-theme";
export const ACCENT_STORAGE_KEY = "taskly-accent";

export function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return localStorage.getItem(THEME_STORAGE_KEY) === "dark" ? "dark" : "light";
}

export function getStoredAccent(): AccentColor {
  if (typeof window === "undefined") return DEFAULT_ACCENT;
  const stored = localStorage.getItem(ACCENT_STORAGE_KEY);
  return (ACCENT_COLORS as readonly string[]).includes(stored ?? "")
    ? (stored as AccentColor)
    : DEFAULT_ACCENT;
}

export function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle("dark", theme === "dark");
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

export function applyAccent(accent: AccentColor): void {
  document.documentElement.style.setProperty("--brand", accent);
  localStorage.setItem(ACCENT_STORAGE_KEY, accent);
}
