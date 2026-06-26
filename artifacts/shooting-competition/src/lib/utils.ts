/**
 * utils.ts
 * --------
 * General-purpose utility helpers used across the app.
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class values into a single Tailwind-safe class string.
 *
 * Uses `clsx` to handle conditional classes (objects, arrays, falsy values)
 * and then passes the result through `tailwind-merge` to resolve conflicts
 * between Tailwind utility classes (e.g. "p-2 p-4" → "p-4").
 *
 * Usage examples:
 *   cn("text-sm", isActive && "font-bold")
 *   cn("px-4", { "bg-red-500": hasError })
 *
 * @param inputs - Any number of class values: strings, objects, arrays, or falsy values.
 * @returns A single merged class name string safe for use with Tailwind CSS.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
