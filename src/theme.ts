import { useSyncExternalStore } from "react";

export type ThemeMode = "dark" | "light";

const palettes = {
  dark: {
    primary: "#F59E0B",
    secondary: "blue",
    accent: "green",
    muted: "gray",
    text: "white",
    error: "red",
    background: "#000000",
    foreground: "#FFFFFF",
  },
  light: {
    primary: "#D97706",
    secondary: "#2563EB",
    accent: "#15803D",
    muted: "#6B7280",
    text: "#111827",
    error: "#DC2626",
    background: "#F5F5F0",
    foreground: "#111827",
  },
} as const;

export const theme = {
  ...palettes.dark,
  mode: "dark" as ThemeMode,
};

type Listener = () => void;
const listeners = new Set<Listener>();

function applyMode(mode: ThemeMode) {
  Object.assign(theme, palettes[mode], { mode });
  listeners.forEach((listener) => listener());
}

export function toggleTheme() {
  applyMode(theme.mode === "dark" ? "light" : "dark");
}

export function subscribeTheme(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useTheme() {
  return useSyncExternalStore(
    subscribeTheme,
    () => theme.mode,
    () => "dark" as ThemeMode,
  );
}

export function getThemePalette(mode: ThemeMode) {
  return palettes[mode];
}
