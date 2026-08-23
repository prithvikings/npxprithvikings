import { Box, Text, type DOMElement, useFocus, useInput } from "ink";
import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";

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
  const { isFocused } = useFocus({ id, autoFocus: index === 0 });
  const headerRef = useRef<DOMElement | null>(null);
  const layoutRef = useRef({ top: 0, height: 1 });

  // Keep the section's current position up to date without causing a focus /
  // scroll feedback loop.
  useLayoutEffect(() => {
    const layout = headerRef.current?.yogaNode?.getComputedLayout();
    if (!layout) return;

    layoutRef.current = { top: layout.top, height: layout.height };
    onPosition(id, layout.top, layout.height);
  });

  // Scroll only when keyboard/tab focus actually enters this section. This is
  // deliberately separate from layout measurement so ordinary scrolling does
  // not re-trigger the auto-scroll logic.
  useEffect(() => {
    if (!isFocused) return;

    const { top, height } = layoutRef.current;
    onFocused(index, top, height);
  }, [isFocused, index, onFocused]);

  useInput(
    (_input, key) => {
      if (key.return && !key.ctrl) onToggle(id);
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
        <Text color={isFocused ? theme.primary : theme.muted}>{collapsed ? "▸ " : "▾ "}</Text>
        <Text bold={isFocused || !collapsed} color={isFocused ? theme.primary : undefined}>{title}</Text>
        <Box flexGrow={1} marginLeft={1}>
          <Text dimColor>────────────────────────────────────────────────────────────────</Text>
        </Box>
      </Box>
      {!collapsed && <Box flexDirection="column">{children}</Box>}
    </Box>
  );
}
