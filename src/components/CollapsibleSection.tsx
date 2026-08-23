import { Box, Text, useBoxMetrics, useFocus, useInput } from "ink";
import { useEffect, useRef, type ReactNode } from "react";

import { theme } from "../theme.js";

interface CollapsibleSectionProps {
  id: string;
  index: number;
  title: string;
  collapsed: boolean;
  onToggle: (id: string) => void;
  onFocused: (index: number, top: number, height: number) => void;
  onPosition: (id: string, top: number, height: number) => void;
  children: ReactNode;
}

export default function CollapsibleSection({
  id,
  index,
  title,
  collapsed,
  onToggle,
  onFocused,
  onPosition,
  children,
}: CollapsibleSectionProps) {
  const { isFocused } = useFocus({
    id,
    autoFocus: index === 0,
  });
  const headerRef = useRef(null);
  const metrics = useBoxMetrics(headerRef);

  useEffect(() => {
    if (!metrics.hasMeasured) {
      return;
    }

    onPosition(id, metrics.top, metrics.height);

    if (isFocused) {
      onFocused(index, metrics.top, metrics.height);
    }
  }, [id, index, isFocused, metrics.hasMeasured, metrics.top, metrics.height, onFocused, onPosition]);

  useInput(
    (_input, key) => {
      if (key.return) {
        onToggle(id);
      }
    },
    { isActive: isFocused },
  );

  return (
    <Box flexDirection="column" marginTop={1}>
      <Box
        ref={headerRef}
        width="100%"
        height={1}
        flexDirection="row"
        aria-role="button"
        aria-label={`${title} section`}
        aria-state={{ expanded: !collapsed, selected: isFocused }}
      >
        <Text color={isFocused ? theme.primary : theme.muted}>
          {collapsed ? "▸ " : "▾ "}
        </Text>
        <Text
          bold={isFocused || !collapsed}
          color={isFocused ? theme.primary : undefined}
        >
          {title}
        </Text>
        <Box flexGrow={1} marginLeft={1}>
          <Text dimColor>────────────────────────────────────────────────────────────────</Text>
        </Box>
      </Box>

      {!collapsed && (
        <Box flexDirection="column">
          {children}
        </Box>
      )}
    </Box>
  );
}
