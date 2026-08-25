import { Box, Text, type DOMElement, useFocusManager, useInput, useStdin, useStdout } from "ink";
import figlet from "figlet";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import CollapsibleSection from "../components/CollapsibleSection.js";
import Navigation from "../components/Navigation.js";
import ScrollViewport from "../components/ScrollViewport.js";
import StatusBar from "../components/StatusBar.js";
import TerminalLink from "../components/TerminalLink.js";
import { useTerminalSize } from "../hooks/useTerminalSize.js";
import { profile } from "../data/profile.js";
import { skills } from "../data/skills.js";
import { experience } from "../data/experience.js";
import { projects } from "../data/projects.js";
import { contact } from "../data/contact.js";
import { theme } from "../theme.js";

interface HomeProps { selectedIndex: number; onNavigate: (page: string, index: number) => void; }
interface SectionPosition { top: number; height: number; }

const SCROLL_STEP = 2;
const MOUSE_SCROLL_STEP = 3;
const SECTION_IDS = ["section-about", "section-experience", "section-projects", "section-stack", "section-highlights", "section-connect"];
const nameArt = figlet.textSync("PRITHVI", { font: "ANSI Shadow", horizontalLayout: "full", verticalLayout: "default" });
const REVEAL_DURATION = 1500;
const REVEAL_TICK = 33;

export default function Home({ selectedIndex, onNavigate }: HomeProps) {
  const { rows } = useTerminalSize();
  const { focus } = useFocusManager();
  const { stdin } = useStdin();
  const { stdout } = useStdout();
  const [scrollOffset, setScrollOffset] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [revealProgress, setRevealProgress] = useState(0);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [viewportTop, setViewportTop] = useState(0);
  const [headerMotto, setHeaderMotto] = useState("");
  const sectionPositions = useRef<Record<string, SectionPosition>>({});
  const headerPositions = useRef<Record<string, SectionPosition>>({});
  const viewportRef = useRef<DOMElement | null>(null);
  const contentRef = useRef<DOMElement | null>(null);
  const scrollOffsetRef = useRef(0);
  const maxScrollOffsetRef = useRef(0);
  const viewportTopRef = useRef(0);
  const viewportHeightRef = useRef(0);
  const pendingFocusRef = useRef<string | null>(null);
  const currentRole = experience[0];
  const featuredProjects = projects.filter((project) => project.featured).slice(0, 2);
  const viewportHeight = Math.max(8, rows - 7);
  const maxScrollOffset = Math.max(0, contentHeight - viewportHeight);

  useEffect(() => { scrollOffsetRef.current = scrollOffset; maxScrollOffsetRef.current = maxScrollOffset; viewportTopRef.current = viewportTop; viewportHeightRef.current = viewportHeight; }, [scrollOffset, maxScrollOffset, viewportTop, viewportHeight]);

  useLayoutEffect(() => {
    const viewportLayout = viewportRef.current?.yogaNode?.getComputedLayout();
    const contentLayout = contentRef.current?.yogaNode?.getComputedLayout();
    if (viewportLayout && viewportLayout.top !== viewportTop) setViewportTop(viewportLayout.top);
    if (contentLayout && contentLayout.height !== contentHeight) setContentHeight(contentLayout.height);
  });

  useEffect(() => {
    const startedAt = Date.now();
    let timer: ReturnType<typeof setInterval> | undefined;
    setRevealProgress(0);

    const tick = () => {
      const progress = Math.min(1, (Date.now() - startedAt) / REVEAL_DURATION);
      setRevealProgress(progress);
      if (progress >= 1 && timer) clearInterval(timer);
    };

    timer = setInterval(tick, REVEAL_TICK);
    tick();
    return () => { if (timer) clearInterval(timer); };
  }, []);

  useEffect(() => { setScrollOffset((current) => Math.min(current, maxScrollOffset)); }, [maxScrollOffset]);

  useEffect(() => {
    const phrases = profile.headerMottos;
    let phraseIndex = 0;
    let characterIndex = 0;
    let deleting = false;
    let pauseUntil = Date.now() + 900;
    setHeaderMotto("");

    const interval = setInterval(() => {
      if (Date.now() < pauseUntil) return;
      const phrase = phrases[phraseIndex];
      if (!deleting) {
        characterIndex += 1;
        setHeaderMotto(phrase.slice(0, characterIndex));
        if (characterIndex === phrase.length) {
          deleting = true;
          pauseUntil = Date.now() + 1400;
        }
      } else {
        characterIndex -= 1;
        setHeaderMotto(phrase.slice(0, characterIndex));
        if (characterIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          pauseUntil = Date.now() + 350;
        }
      }
    }, 170);

    return () => clearInterval(interval);
  }, []);

  const handlePosition = useCallback((id: string, top: number, height: number) => { sectionPositions.current[id] = { top, height }; }, []);
  const handleHeaderPosition = useCallback((id: string, top: number, height: number) => { headerPositions.current[id] = { top, height }; }, []);
  const handleFocus = useCallback((id: string) => { pendingFocusRef.current = id; }, []);

  useLayoutEffect(() => {
    const id = pendingFocusRef.current;
    if (!id) return;
    const position = sectionPositions.current[id];
    if (!position) return;
    pendingFocusRef.current = null;
    const viewportHeightNow = viewportHeightRef.current;
    setScrollOffset((current) => {
      const visibleTop = current;
      const visibleBottom = current + viewportHeightNow;
      if (position.top < visibleTop) return Math.max(0, Math.min(maxScrollOffsetRef.current, position.top));
      if (position.top + position.height > visibleBottom) return Math.max(0, Math.min(maxScrollOffsetRef.current, position.top + position.height - viewportHeightNow));
      return current;
    });
  });

  const toggleSection = useCallback((id: string) => { setCollapsed((current) => ({ ...current, [id]: !current[id] })); }, []);

  useEffect(() => {
    if (!stdin || !stdout) return;
    let remainder = "";
    stdout.write("\x1b[?1000h\x1b[?1006h");
    const applyMouseScroll = (direction: "up" | "down") => { setScrollOffset((current) => Math.max(0, Math.min(maxScrollOffsetRef.current, direction === "up" ? current - MOUSE_SCROLL_STEP : current + MOUSE_SCROLL_STEP))); };
    const handleMouseData = (chunk: Buffer | string) => {
      const data = remainder + chunk.toString(); remainder = ""; let consumedUntil = 0;
      const sgrPattern = /\x1b\[<(\d+);(\d+);(\d+)([Mm])/g; let match: RegExpExecArray | null;
      while ((match = sgrPattern.exec(data)) !== null) {
        consumedUntil = sgrPattern.lastIndex; const button = Number(match[1]); const mouseX = Number(match[2]) - 1; const mouseY = Number(match[3]) - 1;
        if (button === 64) { applyMouseScroll("up"); continue; }
        if (button === 65) { applyMouseScroll("down"); continue; }
        if (button === 0 && match[4] === "M") {
          const currentViewportTop = viewportTopRef.current; const currentOffset = scrollOffsetRef.current;
          for (const id of SECTION_IDS) {
            const position = headerPositions.current[id];
            if (!position) continue;
            const top = currentViewportTop - currentOffset + position.top;
            if (mouseY >= top && mouseY < top + position.height && mouseX >= 0) { focus(id); toggleSection(id); break; }
          }
        }
      }
      const legacyData = data.slice(consumedUntil); let legacyIndex = 0;
      while ((legacyIndex = legacyData.indexOf("\x1b[M", legacyIndex)) !== -1) { if (legacyIndex + 6 > legacyData.length) break; const button = legacyData.charCodeAt(legacyIndex + 3) - 32; if (button === 64) applyMouseScroll("up"); if (button === 65) applyMouseScroll("down"); legacyIndex += 6; }
      const trailingEscape = data.slice(consumedUntil); if (/\x1b(?:\[)?(?:<[^M]*?)?$/.test(trailingEscape)) remainder = trailingEscape;
    };
    stdin.on("data", handleMouseData); return () => { stdin.off("data", handleMouseData); stdout.write("\x1b[?1006l\x1b[?1000l"); };
  }, [focus, stdin, stdout, toggleSection]);

  useInput((input, key) => {
    if (key.downArrow || key.pageDown || input === "j") { setScrollOffset((current) => Math.min(maxScrollOffset, current + (key.pageDown ? 10 : SCROLL_STEP))); return; }
    if (key.upArrow || key.pageUp || input === "k") { setScrollOffset((current) => Math.max(0, current - (key.pageUp ? 10 : SCROLL_STEP))); return; }
    if (key.home) { setScrollOffset(0); return; }
    if (key.end) setScrollOffset(maxScrollOffset);
  });

  const progress = maxScrollOffset === 0 ? 0 : Math.round((scrollOffset / maxScrollOffset) * 100);
  const revealMaskHeight = Math.max(0, Math.round(viewportHeight * Math.pow(1 - revealProgress, 3)));
  const revealMaskOffset = Math.round(viewportHeight * (1 - revealProgress));

  return (
    <Box width="100%" flexDirection="column" flexShrink={0}>
      <Box width="100%" justifyContent="space-between" alignItems="center" flexShrink={0}><Box borderStyle="round" borderColor={theme.muted} paddingX={1}><Text bold>PR</Text></Box><Box flexDirection="row" gap={1} flexShrink={1}><Navigation selectedIndex={selectedIndex} activePage="home" onSelect={onNavigate} /><Box borderStyle="round" borderColor={theme.muted} paddingX={1}><Text>◐</Text></Box></Box></Box>
      <Text dimColor>{"─".repeat(96)}</Text>
      <Box ref={viewportRef} width="100%" height={viewportHeight} flexShrink={0} position="relative" overflow="hidden">
        <ScrollViewport height={viewportHeight} offset={scrollOffset} maxOffset={maxScrollOffset}>
          <Box ref={contentRef} width="100%" flexDirection="column" paddingRight={1} flexShrink={0}>
            <Box width="100%" justifyContent="space-between" alignItems="center">
              <Box width="74%" flexShrink={0}><Text color={theme.primary}>{nameArt}</Text></Box>
              <Box width="22%" flexDirection="column" paddingTop={0} flexShrink={0}>
                <Text bold><Text color={theme.accent}>●</Text> {profile.age} · {profile.headerRole}</Text>
                <Box height={1} width="100%"><Text bold wrap="truncate">{headerMotto || "\u00a0"}</Text></Box>
                <Text bold dimColor wrap="truncate">⌂ {profile.location}</Text>
                <TerminalLink url={profile.website}>[ prithvikings.me ↗ ]</TerminalLink>
              </Box>
            </Box>

            <CollapsibleSection compact id="section-about" index={0} title="about" collapsed={Boolean(collapsed["section-about"])} onToggle={toggleSection} onFocused={handleFocus} onPosition={handlePosition} onHeaderPosition={handleHeaderPosition}><Box marginTop={1} flexDirection="column"><Text wrap="wrap">{profile.summary}</Text>{profile.about.map((paragraph) => <Box key={paragraph} marginTop={1}><Text dimColor wrap="wrap">{paragraph}</Text></Box>)}</Box></CollapsibleSection>
            <CollapsibleSection id="section-experience" index={1} title="experience" collapsed={Boolean(collapsed["section-experience"])} onToggle={toggleSection} onFocused={handleFocus} onPosition={handlePosition} onHeaderPosition={handleHeaderPosition}><Box marginTop={1} flexDirection="column"><Box width="100%" justifyContent="space-between"><Text bold>{currentRole.company}</Text><Text dimColor>{currentRole.period}</Text></Box><Box width="100%" justifyContent="space-between"><Text dimColor wrap="wrap">{currentRole.role}</Text><Text dimColor wrap="wrap">{currentRole.location}</Text></Box><Text> </Text><Text wrap="wrap">{currentRole.description}</Text><Text> </Text>{currentRole.highlights.map((highlight) => <Text key={highlight} dimColor wrap="wrap">· {highlight}</Text>)}</Box></CollapsibleSection>
            <CollapsibleSection id="section-projects" index={2} title="projects" collapsed={Boolean(collapsed["section-projects"])} onToggle={toggleSection} onFocused={handleFocus} onPosition={handlePosition} onHeaderPosition={handleHeaderPosition}><Box marginTop={1} flexDirection="column">{featuredProjects.map((project) => <Box key={project.id} flexDirection="column" marginBottom={1}><Text bold>{project.name}</Text><Text wrap="wrap">{project.shortDescription}</Text><Text dimColor wrap="wrap">{project.highlights.slice(0, 2).map((item) => `· ${item}`).join("  ")}</Text><Text dimColor wrap="wrap">{project.stack.join(" · ")}</Text></Box>)}</Box></CollapsibleSection>
            <CollapsibleSection id="section-stack" index={3} title="stack" collapsed={Boolean(collapsed["section-stack"])} onToggle={toggleSection} onFocused={handleFocus} onPosition={handlePosition} onHeaderPosition={handleHeaderPosition}><Box marginTop={1} flexDirection="column">{skills.map((group) => <Box key={group.title} flexDirection="row" width="100%"><Box width={16} flexShrink={0}><Text dimColor>{group.title.toLowerCase()}</Text></Box><Box flexGrow={1}><Text wrap="wrap">{group.skills.join(" · ")}</Text></Box></Box>)}</Box></CollapsibleSection>
            <CollapsibleSection id="section-highlights" index={4} title="highlights" collapsed={Boolean(collapsed["section-highlights"])} onToggle={toggleSection} onFocused={handleFocus} onPosition={handlePosition} onHeaderPosition={handleHeaderPosition}><Box marginTop={1} flexDirection="column">{profile.highlights.map((highlight) => <Text key={highlight} wrap="wrap">· {highlight}</Text>)}</Box></CollapsibleSection>
            <CollapsibleSection id="section-connect" index={5} title="connect" collapsed={Boolean(collapsed["section-connect"])} onToggle={toggleSection} onFocused={handleFocus} onPosition={handlePosition} onHeaderPosition={handleHeaderPosition}><Box marginTop={1} flexDirection="column"><Box flexDirection="row" gap={2}><TerminalLink url={contact.github}>[ github ]</TerminalLink><TerminalLink url={contact.linkedin}>[ linkedin ]</TerminalLink><TerminalLink url={contact.email}>[ email ]</TerminalLink></Box><Box marginTop={1}><Text dimColor>click to open in your browser</Text></Box></Box></CollapsibleSection>

            <Box marginTop={2} paddingX={1} borderStyle="round" borderColor={theme.muted} flexDirection="column"><Text dimColor>“I was not born with a whole lot of natural talent... but I</Text><Text dimColor>work hard and I never give up.”</Text><Box justifyContent="flex-end"><Text dimColor>— Rock Lee</Text></Box></Box>
            <Box marginTop={2} flexDirection="column" alignItems="center"><Text dimColor>© {new Date().getFullYear()} @prithvikings</Text><Text dimColor>Built with love, LLMs and patience.</Text></Box>
          </Box>
        </ScrollViewport>
        {revealMaskHeight > 0 && <Box position="absolute" marginTop={revealMaskOffset} width="100%" height={revealMaskHeight} backgroundColor="black" />}
      </Box>
      <StatusBar progress={progress} maxOffset={maxScrollOffset} />
    </Box>
  );
}
