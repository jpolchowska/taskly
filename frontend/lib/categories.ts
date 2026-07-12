export const CATEGORIES = ["Study", "Work", "Health", "Home", "Personal"] as const;

export type Category = (typeof CATEGORIES)[number];

type CategoryColor = { light: string; dark: string };

const CATEGORY_COLORS: Record<Category, CategoryColor> = {
  Study: { light: "#6FA3C7", dark: "#8CBBDD" },
  Work: { light: "#7B8FA6", dark: "#9FB0C2" },
  Health: { light: "#7CA37E", dark: "#93BC95" },
  Home: { light: "#C99A57", dark: "#DBB578" },
  Personal: { light: "#B98B9E", dark: "#D2A6B7" },
};

const FALLBACK_COLOR: CategoryColor = { light: "#9B9BA3", dark: "#B4B4BC" };

export function getCategoryColor(category: string): CategoryColor {
  return CATEGORY_COLORS[category as Category] ?? FALLBACK_COLOR;
}
