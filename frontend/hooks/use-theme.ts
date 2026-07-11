"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ACCENT_COLORS,
  DEFAULT_ACCENT,
  applyAccent,
  applyTheme,
  getStoredAccent,
  getStoredTheme,
  type AccentColor,
  type Theme,
} from "@/lib/theme";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");
  const [accent, setAccent] = useState<AccentColor>(DEFAULT_ACCENT);

  useEffect(() => {
    setTheme(getStoredTheme());
    setAccent(getStoredAccent());
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      return next;
    });
  }, []);

  const selectAccent = useCallback((color: AccentColor) => {
    applyAccent(color);
    setAccent(color);
  }, []);

  return { theme, accent, accentOptions: ACCENT_COLORS, toggleTheme, selectAccent };
}
