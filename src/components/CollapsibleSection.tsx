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

  // Measure the section after every layout pass. The parent keeps these
  // coordinates in content-space, independent of the current scroll offset.
  useLayoutEffect(() => {
    const layout = headerRef.current?.yogaNode?.getComputedLayout();
    if (!layout) return;

    layoutRef.current = { top: layout.top, height: layout.height };
    onPosition(id, layout.top, layout.height);
  });

  // Focus changes happen during the same layout cycle as the measurement
  // above. Let the parent perform the actual scroll calculation after all
  // sections have reported their current positions. This avoids using stale
  // coordinates and prevents the viewport from snapping back to the top.
  useLayoutEffect(() => {
    if (!isFocused) return;
    onFocused(id);
  }, [isFocused, id, onFocused]);

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
