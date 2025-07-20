import type { ThemeColor } from "../contexts/ThemeContext";

export function isThemeColor(value: string): value is ThemeColor {
  return value == "teal" || value == "orange-red";
}

export function isString(value: unknown): value is string {
  return typeof value === "string";
}
