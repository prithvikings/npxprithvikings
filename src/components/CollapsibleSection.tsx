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
  showIndex?: boolean;
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
  showIndex = false,
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
        height={1}
        flexDirection="row"
        alignItems="center"
        aria-role="button"
        aria-label={`${title} section`}
        aria-state={{ expanded: !collapsed, selected: isFocused }}
      >
        {showIndex && (
          <Text color={isFocused ? theme.primary : undefined}>
            {String(index + 1).padStart(2, "0")}  
          </Text>
        )}
        <Text color={isFocused ? theme.primary : theme.muted}>
          {collapsed ? "▸ " : "▾ "}
        </Text>
        <Text bold={isFocused || !collapsed} color={isFocused ? theme.primary : undefined}>
          {title}
        </Text>
        <Text> ─────</Text>
      </Box>
      {!collapsed && <Box flexDirection="column">{children}</Box>}
    </Box>
  );
}
