import { Box, Text, type DOMElement, useFocus, useInput } from "ink";
import { useLayoutEffect, useRef, type ReactNode } from "react";

import { theme } from "../theme.js";

interface CollapsibleSectionProps {
  id: string;
  index: number;
  title: string;
  collapsed: boolean;
  onToggle: (id: string) => void;
  onFocused: (id: string) => void;
  onPosition: (id: string, top: number, height: number) => void;
  onHeaderPosition: (id: string, top: number, height: number) => void;
  children: ReactNode;
  compact?: boolean;
}

export default function CollapsibleSection({
  id,
  index,
  title,
  collapsed,
  onToggle,
  onFocused,
  onPosition,
  onHeaderPosition,
  children,
  compact = false,
}: CollapsibleSectionProps) {
  const { isFocused } = useFocus({ id, autoFocus: index === 0 });
  const sectionRef = useRef<DOMElement | null>(null);
  const headerRef = useRef<DOMElement | null>(null);

  useLayoutEffect(() => {
    const layout = sectionRef.current?.yogaNode?.getComputedLayout();
    if (!layout) return;
    onPosition(id, layout.top, layout.height);
  });

  useLayoutEffect(() => {
    const layout = headerRef.current?.yogaNode?.getComputedLayout();
    if (!layout) return;
    onHeaderPosition(id, layout.top, layout.height);
  });

  useLayoutEffect(() => {
    if (isFocused) onFocused(id);
  }, [isFocused, id, onFocused]);

  useInput(
    (_input, key) => {
      if (key.return && !key.ctrl) onToggle(id);
    },
    { isActive: isFocused },
  );

  return (
    <Box ref={sectionRef} flexDirection="column" marginTop={compact ? 0 : 1}>
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
        <Text bold={isFocused || !collapsed} color={isFocused ? theme.primary : undefined}>
          {title}
        </Text>
        <Box flexGrow={1} marginLeft={1}>
          <Text dimColor>────────────────────────────────────────────────────────────────</Text>
        </Box>
      </Box>
      {!collapsed && <Box flexDirection="column">{children}</Box>}
    </Box>
  );
}
