import { Box, Text, useInput } from "ink";
import figlet from "figlet";
import { useEffect, useState } from "react";

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

const SCROLL_MAX = 50;
const SCROLL_STEP = 2;
const MOUSE_SCROLL_STEP = 3;

const nameArt = figlet.textSync("PRITHVI", {
  font: "ANSI Shadow",
  horizontalLayout: "default",
  verticalLayout: "default",
});

function SectionTitle({ title }: { title: string }) {
  return (
    <Box width="100%" flexDirection="row">
      <Text color={theme.primary}>▾ </Text>
      <Text bold>{title}</Text>
      <Box flexGrow={1} marginLeft={1}>
        <Text dimColor>────────────────────────────────────────────────────────────────</Text>
      </Box>
    </Box>
  );
}

export default function Home({ selectedIndex }: HomeProps) {
  const { rows } = useTerminalSize();
  const [scrollOffset, setScrollOffset] = useState(0);
  const currentRole = experience[0];
  const featuredProjects = projects.filter((project) => project.featured).slice(0, 2);
  const viewportHeight = Math.max(8, rows - 7);

  // Ink handles keyboard input for us, but terminal mouse-wheel events are
  // delivered as ANSI mouse sequences. Enable SGR mouse reporting while the
  // Home viewport is mounted so the terminal does not consume the wheel as
  // scrollback and we can use it for the portfolio's own scrollbar.
  useEffect(() => {
    const stdin = process.stdin;
    const stdout = process.stdout;
    let remainder = "";

    const enableMouse = () => {
      stdout.write("\x1b[?1000h\x1b[?1006h");
    };

    const disableMouse = () => {
      stdout.write("\x1b[?1006l\x1b[?1000l");
    };

    const handleMouseData = (chunk: Buffer | string) => {
      const data = remainder + chunk.toString();
      remainder = "";

      // SGR mouse format: ESC [ < button ; x ; y M/m
      // Wheel up/down are button 64/65 respectively.
      const mousePattern = /\x1b\[<(\d+);(\d+);(\d+)([Mm])/g;
      let match: RegExpExecArray | null;
      let lastIndex = 0;

      while ((match = mousePattern.exec(data)) !== null) {
        lastIndex = mousePattern.lastIndex;
        const button = Number(match[1]);

        if (button === 64) {
          setScrollOffset((current) => Math.max(0, current - MOUSE_SCROLL_STEP));
        } else if (button === 65) {
          setScrollOffset((current) => Math.min(SCROLL_MAX, current + MOUSE_SCROLL_STEP));
        }
      }

      // Keep an incomplete escape sequence for the next stdin chunk.
      const trailingEscape = data.slice(lastIndex);
      if (/\x1b(?:\[)?(?:<[^M]*?)?$/.test(trailingEscape)) {
        remainder = trailingEscape;
      }
    };

    enableMouse();
    stdin.on("data", handleMouseData);

    return () => {
      stdin.off("data", handleMouseData);
      disableMouse();
    };
  }, []);

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

      <ScrollViewport
        height={viewportHeight}
        offset={scrollOffset}
        maxOffset={SCROLL_MAX}
      >
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

          <Box marginTop={1} flexDirection="column">
            <SectionTitle title="about" />
            <Text> </Text>
            <Text wrap="wrap">{profile.summary}</Text>
            {profile.about.map((paragraph) => (
              <Box key={paragraph} marginTop={1}>
                <Text dimColor wrap="wrap">{paragraph}</Text>
              </Box>
            ))}
          </Box>

          <Box marginTop={1} flexDirection="column">
            <SectionTitle title="experience" />
            <Text> </Text>
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

          <Box marginTop={1} flexDirection="column">
            <SectionTitle title="projects" />
            <Text> </Text>
            {featuredProjects.map((project) => (
              <Box key={project.id} flexDirection="column" marginBottom={1}>
                <Text bold>{project.name}</Text>
                <Text wrap="wrap">{project.shortDescription}</Text>
                <Text dimColor wrap="wrap">{project.highlights.slice(0, 2).map((item) => `· ${item}`).join("  ")}</Text>
                <Text dimColor wrap="wrap">{project.stack.join(" · ")}</Text>
              </Box>
            ))}
          </Box>

          <Box marginTop={1} flexDirection="column">
            <SectionTitle title="stack" />
            <Text> </Text>
            {skills.map((group) => (
              <Box key={group.title} flexDirection="row" width="100%">
                <Box width={16} flexShrink={0}><Text dimColor>{group.title.toLowerCase()}</Text></Box>
                <Box flexGrow={1}><Text wrap="wrap">{group.skills.join(" · ")}</Text></Box>
              </Box>
            ))}
          </Box>

          <Box marginTop={1} flexDirection="column">
            <SectionTitle title="highlights" />
            <Text> </Text>
            {profile.highlights.map((highlight) => <Text key={highlight} wrap="wrap">· {highlight}</Text>)}
          </Box>
        </Box>
      </ScrollViewport>

      <StatusBar progress={progress} />
    </Box>
  );
}
