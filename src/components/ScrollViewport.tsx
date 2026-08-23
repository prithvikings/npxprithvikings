import { Box, Text, useInput } from "ink";
import { useEffect, useState, type ReactNode } from "react";

import { useTerminalSize } from "../hooks/useTerminalSize.js";
import { theme } from "../theme.js";

interface ScrollViewportProps {
  children: ReactNode;
  height?: number;
  contentHeight?: number;
  onProgressChange?: (progress: number) => void;
}

const SCROLL_STEP = 2;

export default function ScrollViewport({
  children,
  height,
  contentHeight = 64,
  onProgressChange,
}: ScrollViewportProps) {
  const { rows } = useTerminalSize();
  const viewportHeight = height ?? Math.max(6, rows - 8);
  const [offset, setOffset] = useState(0);
  const maxOffset = Math.max(0, contentHeight - viewportHeight);
  const progress = maxOffset === 0 ? 0 : Math.round((offset / maxOffset) * 100);

  useEffect(() => {
    setOffset((current) => Math.min(current, maxOffset));
  }, [maxOffset]);

  useEffect(() => {
    onProgressChange?.(progress);
  }, [onProgressChange, progress]);

  useInput((_input, key) => {
    if (key.upArrow) setOffset((current) => Math.max(0, current - SCROLL_STEP));
    if (key.downArrow) setOffset((current) => Math.min(maxOffset, current + SCROLL_STEP));
    if (key.pageUp) setOffset((current) => Math.max(0, current - viewportHeight));
    if (key.pageDown) setOffset((current) => Math.min(maxOffset, current + viewportHeight));
    if (key.home) setOffset(0);
    if (key.end) setOffset(maxOffset);
  });

  const hasOverflow = maxOffset > 0;
  const thumbHeight = hasOverflow
    ? Math.max(1, Math.round((viewportHeight * viewportHeight) / contentHeight))
    : viewportHeight;
  const thumbTop = hasOverflow
    ? Math.round((offset / maxOffset) * (viewportHeight - thumbHeight))
    : 0;

  const scrollbar = Array.from({ length: viewportHeight }, (_, index) => {
    const isThumb = hasOverflow && index >= thumbTop && index < thumbTop + thumbHeight;
    return isThumb ? "┃" : "│";
  }).join("\n");

  return (
    <Box width="100%" height={viewportHeight} flexDirection="row" flexShrink={0}>
      <Box flexGrow={1} width={0} height={viewportHeight} flexDirection="column" flexShrink={1}>
        <Box width="100%" flexDirection="column" flexShrink={0} marginTop={-offset} paddingRight={1}>
          {children}
        </Box>
      </Box>

      <Box width={1} height={viewportHeight} flexShrink={0}>
        <Text color={hasOverflow ? theme.muted : undefined} dimColor={!hasOverflow}>
          {scrollbar}
        </Text>
      </Box>
    </Box>
  );
}
