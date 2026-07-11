"use client";

import { useTheme } from "@/hooks/use-theme";
import { MoonIcon, SunIcon } from "./icons";

export function Topbar() {
  const { theme, accent, accentOptions, toggleTheme, selectAccent } = useTheme();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="mb-8 flex items-center justify-between">
      <div className="text-[22px] font-semibold tracking-tight text-foreground">{today}</div>

      <div className="flex items-center gap-[18px]">
        <div className="flex items-center gap-[7px]">
          {accentOptions.map((color) => (
            <button
              key={color}
              type="button"
              aria-label="Choose accent color"
              onClick={() => selectAccent(color)}
              className="h-[18px] w-[18px] cursor-pointer rounded-full border-2"
              style={{
                backgroundColor: color,
                borderColor: color === accent ? "var(--foreground)" : "var(--background)",
              }}
            />
          ))}
        </div>

        <div className="h-[22px] w-px bg-border" />

        <button
          type="button"
          aria-label="Toggle theme"
          onClick={toggleTheme}
          className="flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-full border border-border bg-muted text-brand"
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </div>
  );
}
