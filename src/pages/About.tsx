import { Box, Text, useFocusManager, useInput } from "ink";
import { useCallback, useEffect, useState } from "react";

import CollapsibleSection from "../components/CollapsibleSection.js";
import ScrollPageLayout from "../components/ScrollPageLayout.js";
import { profile } from "../data/profile.js";
import { skills } from "../data/skills.js";
import { theme } from "../theme.js";

interface AboutProps {
  selectedIndex?: number;
  onNavigate?: (page: string, index: number) => void;
}

const SECTION_IDS = [
  "about-section-about",
  "about-section-focus",
  "about-section-stack",
  "about-section-highlights",
];

export default function About({ selectedIndex = 1, onNavigate = () => {} }: AboutProps) {
  const { focus } = useFocusManager();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleSection = useCallback((id: string) => {
    setCollapsed((current) => ({ ...current, [id]: !current[id] }));
  }, []);

  const moveSectionFocus = useCallback((direction: 1 | -1) => {
    const activeIdIndex = SECTION_IDS.findIndex((id) => {
      // Ink's focus manager does not expose the active id, so this is driven by
      // the focused-section callback below.
      return false;
    });
    void activeIdIndex;
    return direction;
  }, []);

  const [focusedSection, setFocusedSection] = useState(SECTION_IDS[0]);

  const handleFocused = useCallback((id: string) => {
    setFocusedSection(id);
  }, []);

  useEffect(() => {
    focus(focusedSection);
  }, [focus, focusedSection]);

  useInput((input, key) => {
    if (key.tab) {
      const currentIndex = SECTION_IDS.indexOf(focusedSection);
      const nextIndex = key.shift
        ? (currentIndex - 1 + SECTION_IDS.length) % SECTION_IDS.length
        : (currentIndex + 1) % SECTION_IDS.length;
      focus(SECTION_IDS[nextIndex]);
    }
  });

  return (
    <ScrollPageLayout
      activePage="about"
      selectedIndex={selectedIndex}
      onNavigate={onNavigate}
    >
      <Box flexDirection="column" paddingX={2}>
        <CollapsibleSection
          id={SECTION_IDS[0]}
          index={0}
          title="about"
          collapsed={Boolean(collapsed[SECTION_IDS[0]])}
          onToggle={toggleSection}
          onFocused={handleFocused}
          onPosition={() => {}}
          onHeaderPosition={() => {}}
          compact
          showIndex
        >
          <Box marginTop={1} marginLeft={2} flexDirection="column">
            <Text wrap="wrap">{profile.summary}</Text>
            <Text> </Text>
            {profile.about.map((paragraph) => (
              <Box key={paragraph} marginBottom={1}>
                <Text dimColor wrap="wrap">{paragraph}</Text>
              </Box>
            ))}
          </Box>
        </CollapsibleSection>

        <CollapsibleSection
          id={SECTION_IDS[1]}
          index={1}
          title="focus"
          collapsed={Boolean(collapsed[SECTION_IDS[1]])}
          onToggle={toggleSection}
          onFocused={handleFocused}
          onPosition={() => {}}
          onHeaderPosition={() => {}}
          showIndex
        >
          <Box marginTop={1} marginLeft={2} flexDirection="column">
            {[
              "Full-stack web development",
              "Backend architecture",
              "Developer tooling",
              "AI-powered applications",
            ].map((item) => (
              <Text key={item}>· {item}</Text>
            ))}
          </Box>
        </CollapsibleSection>

        <CollapsibleSection
          id={SECTION_IDS[2]}
          index={2}
          title="core stack"
          collapsed={Boolean(collapsed[SECTION_IDS[2]])}
          onToggle={toggleSection}
          onFocused={handleFocused}
          onPosition={() => {}}
          onHeaderPosition={() => {}}
          showIndex
        >
          <Box marginTop={1} marginLeft={2} flexDirection="column">
            {skills.map((group) => (
              <Text key={group.title} wrap="wrap">
                <Text bold>{group.title}: </Text>
                <Text dimColor>{group.skills.join(" · ")}</Text>
              </Text>
            ))}
          </Box>
        </CollapsibleSection>

        <CollapsibleSection
          id={SECTION_IDS[3]}
          index={3}
          title="highlights"
          collapsed={Boolean(collapsed[SECTION_IDS[3]])}
          onToggle={toggleSection}
          onFocused={handleFocused}
          onPosition={() => {}}
          onHeaderPosition={() => {}}
          showIndex
        >
          <Box marginTop={1} marginLeft={2} flexDirection="column">
            {profile.highlights.map((highlight) => (
              <Text key={highlight}>· {highlight}</Text>
            ))}
          </Box>
        </CollapsibleSection>

        <Box marginTop={2}>
          <Text color={theme.primary} dimColor>
            profile / developer / builder
          </Text>
        </Box>
      </Box>
    </ScrollPageLayout>
  );
}
