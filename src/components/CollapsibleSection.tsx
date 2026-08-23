import { Box, Text, useFocus, useInput } from "ink";
import { useEffect, type ReactNode } from "react";

import { theme } from "../theme.js";

interface CollapsibleSectionProps {
  id: string;
  index: number;
  title: string;
  collapsed: boolean;
  onToggle: (id: string) => void;
  onFocused: (index: number) => void;
  children: ReactNode;
}

export default function CollapsibleSection({
  id,
  index,
  title,
  collapsed,
  onToggle,
  onFocused,
  children,
}: CollapsibleSectionProps) {
  const { isFocused } = useFocus({
    id,
    autoFocus: index === 0,
  });

  useEffect(() => {
    if (isFocused) {
      onFocused(index);
    }
  }, [index, isFocused, onFocused]);

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
        width="100%"
        flexDirection="row"
        aria-role="button"
        aria-label={`${title} section`}
        aria-state={{ expanded: !collapsed }}
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
