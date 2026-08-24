import { Box, Text, useStdin, useStdout } from "ink";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import Navigation from "../components/Navigation.js";
import ScrollViewport from "../components/ScrollViewport.js";
import StatusBar from "../components/StatusBar.js";
import { useTerminalSize } from "../hooks/useTerminalSize.js";
import { projects } from "../data/projects.js";
import { theme } from "../theme.js";

const MOUSE_SCROLL_STEP = 3;

interface ProjectsProps {
  onNavigate: (page: string, index: number) => void;
  selectedIndex: number;
}

export default function Projects({ onNavigate, selectedIndex }: ProjectsProps) {
  const { rows } = useTerminalSize();
  const { stdin } = useStdin();
  const { stdout } = useStdout();
  const [scrollOffset, setScrollOffset] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef<any>(null);
  const scrollOffsetRef = useRef(0);
  const maxScrollOffsetRef = useRef(0);

  const viewportHeight = Math.max(8, rows - 7);
  const maxScrollOffset = Math.max(0, contentHeight - viewportHeight);

  useEffect(() => {
    scrollOffsetRef.current = scrollOffset;
    maxScrollOffsetRef.current = maxScrollOffset;
  }, [scrollOffset, maxScrollOffset]);

  useLayoutEffect(() => {
    const contentLayout = contentRef.current?.yogaNode?.getComputedLayout();
    if (contentLayout && contentLayout.height !== contentHeight) {
      setContentHeight(contentLayout.height);
    }
  });

  useEffect(() => {
    setScrollOffset((current) => Math.min(current, maxScrollOffset));
  }, [maxScrollOffset]);

  useEffect(() => {
    if (!stdin || !stdout) return;

    let remainder = "";
    stdout.write("\x1b[?1000h\x1b[?1006h");

    const applyMouseScroll = (direction: "up" | "down") => {
      setScrollOffset((current) =>
        Math.max(
          0,
          Math.min(
            maxScrollOffsetRef.current,
            direction === "up"
              ? current - MOUSE_SCROLL_STEP
              : current + MOUSE_SCROLL_STEP,
          ),
        ),
      );
    };

    const handleMouseData = (chunk: Buffer | string) => {
      const data = remainder + chunk.toString();
      remainder = "";

      const sgrPattern = /\x1b\[<(\d+);(\d+);(\d+)([Mm])/g;
      let match: RegExpExecArray | null;
      let consumedUntil = 0;

      while ((match = sgrPattern.exec(data)) !== null) {
        consumedUntil = sgrPattern.lastIndex;
        const button = Number(match[1]);
        if (button === 64) applyMouseScroll("up");
        if (button === 65) applyMouseScroll("down");
      }

      const legacyData = data.slice(consumedUntil);
      let legacyIndex = 0;
      while ((legacyIndex = legacyData.indexOf("\x1b[M", legacyIndex)) !== -1) {
        if (legacyIndex + 6 > legacyData.length) break;
        const button = legacyData.charCodeAt(legacyIndex + 3) - 32;
        if (button === 64) applyMouseScroll("up");
        if (button === 65) applyMouseScroll("down");
        legacyIndex += 6;
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

  const progress = maxScrollOffset === 0
    ? 0
    : Math.round((scrollOffset / maxScrollOffset) * 100);

  return (
    <Box width="100%" flexDirection="column" alignItems="center">
      <Box
        width={Math.min(Math.max(70, (process.stdout.columns ?? 118) - 24), 100)}
        flexDirection="column"
        paddingX={1}
      >
        <Box width="100%" justifyContent="space-between" alignItems="center">
          <Box borderStyle="round" borderColor={theme.muted} paddingX={1}>
            <Text bold>PR</Text>
          </Box>
          <Box flexDirection="row" gap={1} flexShrink={1}>
            <Navigation
              selectedIndex={selectedIndex}
              activePage="projects"
              onSelect={onNavigate}
            />
            <Box borderStyle="round" borderColor={theme.muted} paddingX={1}>
              <Text>◐</Text>
            </Box>
          </Box>
        </Box>

        <Text dimColor>{"─".repeat(96)}</Text>

        <Box width="100%" height={viewportHeight} flexShrink={0}>
          <ScrollViewport
            height={viewportHeight}
            offset={scrollOffset}
            maxOffset={maxScrollOffset}
          >
            <Box ref={contentRef} width="100%" flexDirection="column" paddingRight={1}>
              {projects.map((project, index) => (
                <Box key={project.id} flexDirection="column" marginBottom={1}>
                  <Box width="100%" flexDirection="row" alignItems="center">
                    <Text bold>
                      {String(index + 1).padStart(2, "0")}  {project.name}
                    </Text>
                    <Box flexGrow={1} marginLeft={1}>
                      <Text dimColor>{"─".repeat(90)}</Text>
                    </Box>
                  </Box>

                  <Box marginLeft={2} marginTop={1} flexDirection="column">
                    <Text wrap="wrap">{project.description}</Text>
                    <Text> </Text>
                    <Text dimColor wrap="wrap">{project.stack.join(" · ")}</Text>
                    <Text> </Text>
                    <Box flexDirection="row" gap={2}>
                      {project.links.demo && <Text>[ live ↗ ]</Text>}
                      {project.links.github && <Text>[ code ↗ ]</Text>}
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </ScrollViewport>
        </Box>

        <StatusBar progress={progress} />
      </Box>
    </Box>
  );
}
