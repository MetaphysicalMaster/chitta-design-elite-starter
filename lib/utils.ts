import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names with clsx + tailwind-merge.
 * Use for ALL conditional class strings. Required by Elite UI/UX Engineer Charter.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
