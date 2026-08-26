import { useSyncExternalStore } from "react";

export type ThemeMode = "dark" | "light";

export interface ThemePalette {
  primary: string;
  secondary: string;
  accent: string;
  muted: string;
  text: string;
  error: string;
  background: string;
  foreground: string;
}

const palettes: Record<ThemeMode, ThemePalette> = {
  dark: {
    primary: "#F59E0B",
    secondary: "blue",
    accent: "green",
    muted: "#6B7280",
    text: "#FFFFFF",
    error: "#EF4444",
    background: "#000000",
    foreground: "#FFFFFF",
  },
  light: {
    primary: "#D97706",
    secondary: "#2563EB",
    accent: "#15803D",
    muted: "#4B5563",
    text: "#111827",
    error: "#DC2626",
    background: "#F5F5F0",
    foreground: "#111827",
  },
};

interface ThemeState extends ThemePalette {
  mode: ThemeMode;
  version: number;
}

export const theme: ThemeState = {
  ...palettes.dark,
  mode: "dark",
  version: 0,
};

type Listener = () => void;
const listeners = new Set<Listener>();
let transitionTimer: ReturnType<typeof setInterval> | undefined;

function hexToRgb(hex: string) {
  const value = hex.replace("#", "");
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b]
    .map((value) => Math.round(value).toString(16).padStart(2, "0"))
    .join("")}`;
}

function interpolateColor(from: string, to: string, progress: number) {
  const start = hexToRgb(from);
  const end = hexToRgb(to);
  return rgbToHex(
    start.r + (end.r - start.r) * progress,
    start.g + (end.g - start.g) * progress,
    start.b + (end.b - start.b) * progress,
  );
}

function setTerminalForeground(color: string) {
  if (!process.stdout.isTTY) return;
  const { r, g, b } = hexToRgb(color);
  process.stdout.write(`\x1b[38;2;${r};${g};${b}m`);
}

function notify() {
  theme.version += 1;
  listeners.forEach((listener) => listener());
}

setTerminalForeground(theme.foreground);
process.once("exit", () => {
  if (process.stdout.isTTY) process.stdout.write("\x1b[39m");
});

export function toggleTheme() {
  const fromMode = theme.mode;
  const toMode: ThemeMode = fromMode === "dark" ? "light" : "dark";
  const from = { ...theme };
  const target = palettes[toMode];
  const startedAt = Date.now();
  const duration = 280;

  if (transitionTimer) clearInterval(transitionTimer);
  theme.mode = toMode;

  const tick = () => {
    const progress = Math.min(1, (Date.now() - startedAt) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);

    theme.primary = interpolateColor(from.primary, target.primary, eased);
    theme.accent = interpolateColor(from.accent, target.accent, eased);
    theme.muted = interpolateColor(from.muted, target.muted, eased);
    theme.text = interpolateColor(from.text, target.text, eased);
    theme.error = interpolateColor(from.error, target.error, eased);
    theme.background = interpolateColor(from.background, target.background, eased);
    theme.foreground = interpolateColor(from.foreground, target.foreground, eased);

    setTerminalForeground(theme.foreground);
    notify();

    if (progress >= 1) {
      theme.primary = target.primary;
      theme.accent = target.accent;
      theme.muted = target.muted;
      theme.text = target.text;
      theme.error = target.error;
      theme.background = target.background;
      theme.foreground = target.foreground;
      setTerminalForeground(theme.foreground);
      notify();
      if (transitionTimer) clearInterval(transitionTimer);
      transitionTimer = undefined;
    }
  };

  transitionTimer = setInterval(tick, 24);
  tick();
}

export function subscribeTheme(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useTheme() {
  return useSyncExternalStore(
    subscribeTheme,
    () => theme.version,
    () => 0,
  );
}
