import { Box, Text, useBoxMetrics, useFocusManager, useInput } from "ink";
import figlet from "figlet";
import { useEffect, useRef, useState } from "react";

import CollapsibleSection from "../components/CollapsibleSection.js";
import Navigation from "../components/Navigation.js";
import ScrollViewport from "../components/ScrollViewport.js";
import StatusBar from "../components/StatusBar.js";
import { useTerminalSize } from "../hooks/useTerminalSize.js";
import { profile } from "../data/profile.js";
import { skills } from "../data/skills.js";
import { experience } from "../data/experience.js";
import { projects } from "../data/projects.js";
import { theme } from "../theme.js";

interface HomeProps {
  selectedIndex: number;
}

interface SectionPosition {
  top: number;
  height: number;
}

const SCROLL_MAX = 50;
const SCROLL_STEP = 2;
const MOUSE_SCROLL_STEP = 3;
const SECTION_IDS = ["section-about", "section-experience", "section-projects", "section-stack", "section-highlights"];

const nameArt = figlet.textSync("PRITHVI", {
  font: "ANSI Shadow",
  horizontalLayout: "default",
  verticalLayout: "default",
});

export default function Home({ selectedIndex }: HomeProps) {
  const { rows } = useTerminalSize();
  const { focus, activeId } = useFocusManager();
  const [scrollOffset, setScrollOffset] = useState(0);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const sectionPositions = useRef<Record<string, SectionPosition>>({});
  const viewportRef = useRef(null);
  const viewportMetrics = useBoxMetrics(viewportRef);
  const currentRole = experience[0];
  const featuredProjects = projects.filter((project) => project.featured).slice(0, 2);
  const viewportHeight = Math.max(8, rows - 7);

  const handlePosition = (id: string, top: number, height: number) => {
    sectionPositions.current[id] = { top, height };
  };

  const handleFocus = (_index: number, top: number, height: number) => {
    setScrollOffset((current) => {
      const bottom = top + height;
      if (top < 0) {
        return Math.max(0, Math.min(SCROLL_MAX, current + top));
      }
      if (bottom > viewportHeight) {
        return Math.max(0, Math.min(SCROLL_MAX, current + bottom - viewportHeight));
      }
      return current;
    });
  };

  const toggleSection = (id: string) => {
    setCollapsed((current) => ({
      ...current,
      [id]: !current[id],
    }));
  };

  useEffect(() => {
    const stdin = process.stdin;
    const stdout = process.stdout;
    let remainder = "";

    stdout.write("\x1b[?1000h\x1b[?1006h");

    const handleMouseData = (chunk: Buffer | string) => {
      const data = remainder + chunk.toString();
      remainder = "";
      const mousePattern = /\x1b\[<(\d+);(\d+);(\d+)([Mm])/g;
      let match: RegExpExecArray | null;
      let lastIndex = 0;

      while ((match = mousePattern.exec(data)) !== null) {
        lastIndex = mousePattern.lastIndex;
        const button = Number(match[1]);
        const mouseX = Number(match[2]) - 1;
        const mouseY = Number(match[3]) - 1;

        if (button === 64) {
          setScrollOffset((current) => Math.max(0, current - MOUSE_SCROLL_STEP));
          continue;
        }

        if (button === 65) {
          setScrollOffset((current) => Math.min(SCROLL_MAX, current + MOUSE_SCROLL_STEP));
          continue;
        }

        if (button === 0 && match[4] === "M") {
          const viewportTop = viewportMetrics.top;
          const viewportWidth = viewportMetrics.width;
          if (mouseY < viewportTop || mouseY >= viewportTop + viewportHeight || mouseX < 0 || mouseX >= viewportWidth) {
            continue;
          }

          for (const id of SECTION_IDS) {
            const position = sectionPositions.current[id];
            if (!position) {
              continue;
            }

            const top = viewportTop + position.top;
            if (mouseY >= top && mouseY < top + position.height) {
              focus(id);
              toggleSection(id);
              break;
            }
          }
        }
      }

      const trailingEscape = data.slice(lastIndex);
      if (/\x1b(?:\[)?(?:<[^M]*?)?$/.test(trailingEscape)) {
        remainder = trailingEscape;
      }
    };

    stdin.on("data", handleMouseData);
    return () => {
      stdin.off("data", handleMouseData);
      stdout.write("\x1b[?1006l\x1b[?1000l");
    };
  }, [focus, viewportHeight, viewportMetrics.top, viewportMetrics.width]);

  useInput((input, key) => {
    if (key.downArrow || key.pageDown || input === "j") {
      setScrollOffset((current) => Math.min(SCROLL_MAX, current + (key.pageDown ? 10 : SCROLL_STEP)));
      return;
    }

    if (key.upArrow || key.pageUp || input === "k") {
      setScrollOffset((current) => Math.max(0, current - (key.pageUp ? 10 : SCROLL_STEP)));
      return;
    }

    if (key.home) {
      setScrollOffset(0);
      return;
    }

    if (key.end) {
      setScrollOffset(SCROLL_MAX);
    }
  });

  const progress = Math.round((scrollOffset / SCROLL_MAX) * 100);

  return (
    <Box width="100%" flexDirection="column" flexShrink={0}>
      <Box width="100%" justifyContent="space-between" alignItems="center" flexShrink={0}>
        <Box borderStyle="round" borderColor={theme.muted} paddingX={1}>
          <Text bold>PR</Text>
        </Box>
        <Box flexDirection="row" gap={1} flexShrink={1}>
          <Navigation selectedIndex={selectedIndex} activePage="home" />
          <Box borderStyle="round" borderColor={theme.muted} paddingX={1}>
            <Text>◐</Text>
          </Box>
        </Box>
      </Box>

      <Text dimColor>────────────────────────────────────────────────────────────────────────────────────────────────</Text>

      <Box ref={viewportRef} width="100%" height={viewportHeight} flexShrink={0}>
        <ScrollViewport height={viewportHeight} offset={scrollOffset} maxOffset={SCROLL_MAX}>
          <Box width="100%" flexDirection="column" paddingRight={1}>
            <Box width="100%" alignItems="flex-start">
              <Text bold color={theme.primary}>{nameArt}</Text>
            </Box>

            <Box width="100%" justifyContent="space-between" marginTop={0}>
              <Box flexDirection="column" width="70%">
                <Text bold>{profile.title}</Text>
                <Text dimColor wrap="wrap">{profile.tagline}</Text>
              </Box>
              <Box flexDirection="column" width="26%">
                <Text color={theme.primary}>● AVAILABLE</Text>
                <Text wrap="wrap">{profile.location}</Text>
              </Box>
            </Box>

            <CollapsibleSection id="section-about" index={0} title="about" collapsed={Boolean(collapsed["section-about"])} onToggle={toggleSection} onFocused={handleFocus} onPosition={handlePosition}>
              <Box marginTop={1} flexDirection="column">
                <Text wrap="wrap">{profile.summary}</Text>
                {profile.about.map((paragraph) => (
                  <Box key={paragraph} marginTop={1}>
                    <Text dimColor wrap="wrap">{paragraph}</Text>
                  </Box>
                ))}
              </Box>
            </CollapsibleSection>

            <CollapsibleSection id="section-experience" index={1} title="experience" collapsed={Boolean(collapsed["section-experience"])} onToggle={toggleSection} onFocused={handleFocus} onPosition={handlePosition}>
              <Box marginTop={1} flexDirection="column">
                <Box width="100%" justifyContent="space-between">
                  <Text bold>{currentRole.company}</Text>
                  <Text dimColor>{currentRole.period}</Text>
                </Box>
                <Box width="100%" justifyContent="space-between">
                  <Text dimColor wrap="wrap">{currentRole.role}</Text>
                  <Text dimColor wrap="wrap">{currentRole.location}</Text>
                </Box>
                <Text> </Text>
                <Text wrap="wrap">{currentRole.description}</Text>
                <Text> </Text>
                {currentRole.highlights.map((highlight) => <Text key={highlight} dimColor wrap="wrap">· {highlight}</Text>)}
              </Box>
            </CollapsibleSection>

            <CollapsibleSection id="section-projects" index={2} title="projects" collapsed={Boolean(collapsed["section-projects"])} onToggle={toggleSection} onFocused={handleFocus} onPosition={handlePosition}>
              <Box marginTop={1} flexDirection="column">
                {featuredProjects.map((project) => (
                  <Box key={project.id} flexDirection="column" marginBottom={1}>
                    <Text bold>{project.name}</Text>
                    <Text wrap="wrap">{project.shortDescription}</Text>
                    <Text dimColor wrap="wrap">{project.highlights.slice(0, 2).map((item) => `· ${item}`).join("  ")}</Text>
                    <Text dimColor wrap="wrap">{project.stack.join(" · ")}</Text>
                  </Box>
                ))}
              </Box>
            </CollapsibleSection>

            <CollapsibleSection id="section-stack" index={3} title="stack" collapsed={Boolean(collapsed["section-stack"])} onToggle={toggleSection} onFocused={handleFocus} onPosition={handlePosition}>
              <Box marginTop={1} flexDirection="column">
                {skills.map((group) => (
                  <Box key={group.title} flexDirection="row" width="100%">
                    <Box width={16} flexShrink={0}><Text dimColor>{group.title.toLowerCase()}</Text></Box>
                    <Box flexGrow={1}><Text wrap="wrap">{group.skills.join(" · ")}</Text></Box>
                  </Box>
                ))}
              </Box>
            </CollapsibleSection>

            <CollapsibleSection id="section-highlights" index={4} title="highlights" collapsed={Boolean(collapsed["section-highlights"])} onToggle={toggleSection} onFocused={handleFocus} onPosition={handlePosition}>
              <Box marginTop={1} flexDirection="column">
                {profile.highlights.map((highlight) => <Text key={highlight} wrap="wrap">· {highlight}</Text>)}
              </Box>
            </CollapsibleSection>
          </Box>
        </ScrollViewport>
      </Box>

      <StatusBar progress={progress} />
      {activeId && <Text dimColor>tab select • enter fold • click toggle • focused: {activeId.replace("section-", "")}</Text>}
    </Box>
  );
}
