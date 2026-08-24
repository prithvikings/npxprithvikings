import { Box, Text } from "ink";
import { type ReactNode } from "react";

import { theme } from "../theme.js";

interface ScrollViewportProps {
  children: ReactNode;
  height: number;
  offset: number;
  maxOffset: number;
}

export default function ScrollViewport({
  children,
  height,
  offset,
  maxOffset,
}: ScrollViewportProps) {
  const safeOffset = Math.max(0, Math.min(offset, maxOffset));
  const hasOverflow = maxOffset > 0;
  const thumbHeight = hasOverflow
    ? Math.max(2, Math.round((height * height) / (height + maxOffset)))
    : height;
  const thumbTop = hasOverflow
    ? Math.round((safeOffset / maxOffset) * (height - thumbHeight))
    : 0;

  return (
    <Box width="100%" height={height} flexDirection="row" flexShrink={0}>
      <Box
        flexGrow={1}
        width={0}
        height={height}
        flexDirection="column"
        flexShrink={1}
        overflow="hidden"
      >
        <Box
          width="100%"
          flexDirection="column"
          flexShrink={0}
          marginTop={-safeOffset}
          paddingRight={1}
        >
          {children}
        </Box>
      </Box>

      <Box width={2} height={height} flexShrink={0} flexDirection="column">
        {Array.from({ length: height }, (_, index) => {
          const isThumb = hasOverflow && index >= thumbTop && index < thumbTop + thumbHeight;
          return (
            <Text key={index} color={isThumb ? "white" : theme.muted} dimColor={!isThumb}>
              {isThumb ? "┃ " : "│ "}
            </Text>
          );
        })}
      </Box>
    </Box>
  );
}
