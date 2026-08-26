import { Box, Text, useInput, useStdin, useStdout, type DOMElement } from "ink";
import { type ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";

import Navigation from "./Navigation.js";
import ScrollViewport from "./ScrollViewport.js";
import StatusBar from "./StatusBar.js";
import ThemeToggle from "./ThemeToggle.js";
import { useTerminalSize } from "../hooks/useTerminalSize.js";
import { theme, useTheme } from "../theme.js";

const MOUSE_SCROLL_STEP = 3;
const KEY_SCROLL_STEP = 1;
const REVEAL_DURATION = 1500;
const REVEAL_TICK = 33;

interface ScrollPageLayoutProps {
  activePage: string;
  selectedIndex: number;
  onNavigate: (page: string, index: number) => void;
  children: ReactNode;
}

export default function ScrollPageLayout({
  activePage,
  selectedIndex,
  onNavigate,
  children,
}: ScrollPageLayoutProps) {
  const { rows } = useTerminalSize();
  useTheme();
  const { stdin } = useStdin();
  const { stdout } = useStdout();
  const [scrollOffset, setScrollOffset] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [revealProgress, setRevealProgress] = useState(0);
  const contentRef = useRef<DOMElement | null>(null);
  const maxScrollOffsetRef = useRef(0);

  const viewportHeight = Math.max(8, rows - 7);
  const maxScrollOffset = Math.max(0, contentHeight - viewportHeight);

  useEffect(() => {
    maxScrollOffsetRef.current = maxScrollOffset;
  }, [maxScrollOffset]);

  useLayoutEffect(() => {
    const contentLayout = contentRef.current?.yogaNode?.getComputedLayout();
    if (contentLayout && contentLayout.height !== contentHeight) {
      setContentHeight(contentLayout.height);
    }
  });

  useEffect(() => {
    const startedAt = Date.now();
    let timer: ReturnType<typeof setInterval> | undefined;

    setRevealProgress(0);

    const tick = () => {
      const progress = Math.min(1, (Date.now() - startedAt) / REVEAL_DURATION);
      setRevealProgress(progress);
      if (progress >= 1 && timer) clearInterval(timer);
    };

    timer = setInterval(tick, REVEAL_TICK);
    tick();

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [activePage]);

  useEffect(() => {
    setScrollOffset((current) => Math.min(current, maxScrollOffset));
  }, [maxScrollOffset]);

  useInput((_, key) => {
    if (key.upArrow) {
      setScrollOffset((current) => Math.max(0, current - KEY_SCROLL_STEP));
    }

    if (key.downArrow) {
      setScrollOffset((current) =>
        Math.min(maxScrollOffsetRef.current, current + KEY_SCROLL_STEP),
      );
    }
  });

  useEffect(() => {
    if (!stdin || !stdout) return;

    let remainder = "";
    stdout.write("\x1b[?1000h\x1b[?1006h");

    const applyMouseScroll = (direction: "up" | "down") => {
      setScrollOffset((current) =>
        Math.max(
          0,
          Math.min(
            maxScrollOffsetRef.current,
            direction === "up"
              ? current - MOUSE_SCROLL_STEP
              : current + MOUSE_SCROLL_STEP,
          ),
        ),
      );
    };

    const handleMouseData = (chunk: Buffer | string) => {
      const data = remainder + chunk.toString();
      remainder = "";

      const sgrPattern = /\x1b\[<(\d+);(\d+);(\d+)([Mm])/g;
      let match: RegExpExecArray | null;
      let consumedUntil = 0;

      while ((match = sgrPattern.exec(data)) !== null) {
        consumedUntil = sgrPattern.lastIndex;
        const button = Number(match[1]);
        if (button === 64) applyMouseScroll("up");
        if (button === 65) applyMouseScroll("down");
      }

      const legacyData = data.slice(consumedUntil);
      let legacyIndex = 0;
      while ((legacyIndex = legacyData.indexOf("\x1b[M", legacyIndex)) !== -1) {
        if (legacyIndex + 6 > legacyData.length) break;
        const button = legacyData.charCodeAt(legacyIndex + 3) - 32;
        if (button === 64) applyMouseScroll("up");
        if (button === 65) applyMouseScroll("down");
        legacyIndex += 6;
      }

      const trailingEscape = data.slice(consumedUntil);
      if (/\x1b(?:\[)?(?:<[^M]*?)?$/.test(trailingEscape)) {
        remainder = trailingEscape;
      }
    };

    stdin.on("data", handleMouseData);
    return () => {
      stdin.off("data", handleMouseData);
      stdout.write("\x1b[?1006l\x1b[?1000l");
    };
  }, [stdin, stdout]);

  const progress = maxScrollOffset === 0
    ? 0
    : Math.round((Math.min(scrollOffset, maxScrollOffset) / maxScrollOffset) * 100);
  const revealMaskHeight = Math.max(
    0,
    Math.round(viewportHeight * Math.pow(1 - revealProgress, 3)),
  );

  return (
    <Box
      width="100%"
      height={rows}
      flexDirection="column"
      alignItems="center"
      backgroundColor={theme.background}
    >
      <Box
        width={Math.min(Math.max(70, (process.stdout.columns ?? 118) - 24), 100)}
        flexDirection="column"
        paddingX={1}
      >
        <Box width="100%" justifyContent="space-between" alignItems="center">
          <Box borderStyle="round" borderColor={theme.muted} paddingX={1}>
            <Text bold>PR</Text>
          </Box>

          <Box flexDirection="row" gap={1} flexShrink={1}>
            <Navigation
              selectedIndex={selectedIndex}
              activePage={activePage}
              onSelect={onNavigate}
            />
            <ThemeToggle />
          </Box>
        </Box>

        <Text dimColor>{"─".repeat(96)}</Text>

        <Box width="100%" height={viewportHeight} flexShrink={0} position="relative">
          <ScrollViewport
            height={viewportHeight}
            offset={scrollOffset}
            maxOffset={maxScrollOffset}
          >
            <Box ref={contentRef} width="100%" flexDirection="column" paddingRight={1}>
              {children}
            </Box>
          </ScrollViewport>
          {revealMaskHeight > 0 && (
            <Box
              position="absolute"
              width="100%"
              height={revealMaskHeight}
              backgroundColor={theme.background}
            />
          )}
        </Box>

        <StatusBar progress={progress} maxOffset={maxScrollOffset} />
      </Box>
    </Box>
  );
}
