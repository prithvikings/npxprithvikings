import { Box, Text, type DOMElement, useStdin, useStdout } from "ink";
import { useEffect, useRef } from "react";

import { navigationItems } from "../data/navigation.js";
import { theme } from "../theme.js";

interface NavigationProps {
  selectedIndex: number;
  activePage?: string;
  onSelect?: (page: string, index: number) => void;
}

function getAbsoluteLayout(element: DOMElement) {
  let node: any = element.yogaNode;
  let x = 0;
  let y = 0;

  while (node) {
    const layout = node.getComputedLayout();
    x += layout.left ?? 0;
    y += layout.top ?? 0;
    node = typeof node.getParent === "function" ? node.getParent() : null;
  }

  return { x, y };
}

export default function Navigation({
  selectedIndex,
  activePage,
  onSelect,
}: NavigationProps) {
  const { stdin } = useStdin();
  const { stdout } = useStdout();
  const itemRefs = useRef<Array<DOMElement | null>>([]);

  useEffect(() => {
    if (!onSelect || !stdin || !stdout) return;

    let remainder = "";
    stdout.write("\x1b[?1000h\x1b[?1006h");

    const handleMouseData = (chunk: Buffer | string) => {
      const data = remainder + chunk.toString();
      remainder = "";
      const sgrPattern = /\x1b\[<(\d+);(\d+);(\d+)([Mm])/g;
      let match: RegExpExecArray | null;
      let consumedUntil = 0;

      while ((match = sgrPattern.exec(data)) !== null) {
        consumedUntil = sgrPattern.lastIndex;
        const button = Number(match[1]);
        if (button !== 0 || match[4] !== "M") continue;

        const mouseX = Number(match[2]) - 1;
        const mouseY = Number(match[3]) - 1;

        for (let index = 0; index < itemRefs.current.length; index += 1) {
          const item = itemRefs.current[index];
          if (!item) continue;
          const layout = item.yogaNode?.getComputedLayout?.();
          if (!layout) continue;
          const absolute = getAbsoluteLayout(item);
          const width = layout.width ?? 0;
          const height = layout.height ?? 0;

          if (
            mouseX >= absolute.x &&
            mouseX < absolute.x + width &&
            mouseY >= absolute.y &&
            mouseY < absolute.y + height
          ) {
            onSelect(navigationItems[index].page, index);
            break;
          }
        }
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
  }, [onSelect, stdin, stdout]);

  return (
    <Box flexDirection="row" gap={1}>
      {navigationItems.map((item, index) => {
        const selected = activePage
          ? item.page === activePage
          : index === selectedIndex;

        return (
          <Box
            key={item.page}
            ref={(element) => {
              itemRefs.current[index] = element;
            }}
            borderStyle="round"
            borderColor={selected ? theme.primary : theme.muted}
            paddingX={1}
          >
            <Text bold={selected} color={selected ? theme.primary : undefined}>
              {item.label}
            </Text>
          </Box>
        );
      })}
    </Box>
  );
}
