import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function getRiskColor(level: "Critical" | "High" | "Medium" | "Low"): {
  text: string;
  bg: string;
  border: string;
  badge: string;
  dot: string;
} {
  switch (level) {
    case "Critical":
      return {
        text: "text-rose-400",
        bg: "bg-rose-500/10",
        border: "border-rose-500/30",
        badge: "bg-rose-950/60 text-rose-300 border-rose-500/40",
        dot: "bg-rose-500",
      };
    case "High":
      return {
        text: "text-amber-400",
        bg: "bg-amber-500/10",
        border: "border-amber-500/30",
        badge: "bg-amber-950/60 text-amber-300 border-amber-500/40",
        dot: "bg-amber-500",
      };
    case "Medium":
      return {
        text: "text-yellow-400",
        bg: "bg-yellow-500/10",
        border: "border-yellow-500/30",
        badge: "bg-yellow-950/60 text-yellow-300 border-yellow-500/40",
        dot: "bg-yellow-500",
      };
    case "Low":
    default:
      return {
        text: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/30",
        badge: "bg-emerald-950/60 text-emerald-300 border-emerald-500/40",
        dot: "bg-emerald-500",
      };
  }
}
