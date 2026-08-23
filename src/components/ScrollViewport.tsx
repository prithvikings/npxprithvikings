import { Box, Text, useInput, useWindowSize } from "ink";
import { useEffect, useState, type ReactNode } from "react";

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
  const { rows } = useWindowSize();
  const viewportHeight = height ?? Math.max(6, rows - 7);
  const [offset, setOffset] = useState(0);
  const maxOffset = Math.max(0, contentHeight - viewportHeight);
  const progress = maxOffset === 0
    ? 0
    : Math.round((offset / maxOffset) * 100);

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

  return (
    <Box
      width="100%"
      height={viewportHeight}
      position="relative"
      overflow="hidden"
      flexDirection="column"
      flexShrink={0}
    >
      <Box
        width="100%"
        flexDirection="column"
        flexShrink={0}
        marginTop={-offset}
        paddingRight={2}
      >
        {children}
      </Box>

      <Box position="absolute" right={0} top={0} width={1} height={viewportHeight}>
        <Text dimColor color={theme.muted}>
          {"│\n".repeat(Math.max(0, viewportHeight - 1))}│
        </Text>
      </Box>

      {hasOverflow && (
        <Box position="absolute" right={0} top={thumbTop} width={1} height={thumbHeight}>
          <Text color={theme.muted}>
            {"┃\n".repeat(Math.max(0, thumbHeight - 1))}┃
          </Text>
        </Box>
      )}
    </Box>
  );
}
