import { Box, Text, type DOMElement, useStdin, useStdout } from "ink";
import { useEffect, useRef } from "react";

import { theme, toggleTheme, useTheme } from "../theme.js";

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

export default function ThemeToggle() {
  useTheme();
  const { stdin } = useStdin();
  const { stdout } = useStdout();
  const ref = useRef<DOMElement | null>(null);

  useEffect(() => {
    if (!stdin || !stdout) return;

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
        if (Number(match[1]) !== 0 || match[4] !== "M") continue;

        const layout = ref.current?.yogaNode?.getComputedLayout();
        if (!layout || !ref.current) continue;

        const absolute = getAbsoluteLayout(ref.current);
        const mouseX = Number(match[2]) - 1;
        const mouseY = Number(match[3]) - 1;

        if (
          mouseX >= absolute.x &&
          mouseX < absolute.x + (layout.width ?? 0) &&
          mouseY >= absolute.y &&
          mouseY < absolute.y + (layout.height ?? 0)
        ) {
          toggleTheme();
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
  }, [stdin, stdout]);

  return (
    <Box
      ref={ref}
      borderStyle="round"
      borderColor={theme.muted}
      paddingX={1}
    >
      <Text color={theme.mode === "light" ? theme.primary : undefined}>◐</Text>
    </Box>
  );
}
