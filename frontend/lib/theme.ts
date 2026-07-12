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
  applyFavicon(accent);
}

// Mirrors the checkmark mark baked into app/icon.svg, recolored to the
// active accent so the browser tab matches whatever the user picked.
function faviconSvg(accent: AccentColor): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="${accent}"/><path d="M9 16.5l4.5 4.5L23 11" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`;
}

// Next.js renders app/icon.svg's <link rel="icon"> as part of its own
// metadata tree, and re-asserts its original href on hydration — so this
// writes to a second, React-untouched link instead of fighting that one.
export function applyFavicon(accent: AccentColor): void {
  const link =
    document.querySelector<HTMLLinkElement>("link[data-accent-icon]") ??
    document.head.appendChild(document.createElement("link"));
  link.rel = "icon";
  link.setAttribute("data-accent-icon", "");
  link.href = `data:image/svg+xml,${encodeURIComponent(faviconSvg(accent))}`;
}
