import { Box, Text, useFocusManager, useInput } from "ink";
import { useCallback, useState } from "react";

import CollapsibleSection from "../components/CollapsibleSection.js";
import PageFooter from "../components/PageFooter.js";
import ScrollPageLayout from "../components/ScrollPageLayout.js";
import { experience } from "../data/experience.js";

interface ExperienceProps {
  selectedIndex?: number;
  onNavigate?: (page: string, index: number) => void;
}

const SECTION_IDS = [
  "experience-section-experience",
  "experience-section-stack",
  "experience-section-highlights",
];

export default function Experience({ selectedIndex = 2, onNavigate = () => {} }: ExperienceProps) {
  const { focus } = useFocusManager();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [focusedSection, setFocusedSection] = useState(SECTION_IDS[0]);
  const item = experience[0];

  const toggleSection = useCallback((id: string) => {
    setCollapsed((current) => ({ ...current, [id]: !current[id] }));
  }, []);

  const handleFocused = useCallback((id: string) => {
    setFocusedSection(id);
  }, []);

  useInput((_, key) => {
    if (!key.tab) return;

    const currentIndex = SECTION_IDS.indexOf(focusedSection);
    const nextIndex = key.shift
      ? (currentIndex - 1 + SECTION_IDS.length) % SECTION_IDS.length
      : (currentIndex + 1) % SECTION_IDS.length;

    focus(SECTION_IDS[nextIndex]);
  });

  if (!item) return null;

  return (
    <ScrollPageLayout
      activePage="experience"
      selectedIndex={selectedIndex}
      onNavigate={onNavigate}
    >
      <Box flexDirection="column" paddingX={2}>
        <CollapsibleSection
          id={SECTION_IDS[0]}
          index={0}
          title="experience"
          collapsed={Boolean(collapsed[SECTION_IDS[0]])}
          onToggle={toggleSection}
          onFocused={handleFocused}
          onPosition={() => {}}
          onHeaderPosition={() => {}}
          showIndex
        >
          <Box marginTop={1} marginLeft={2} flexDirection="column">
            <Box width="100%" flexDirection="row" justifyContent="space-between">
              <Box flexDirection="column">
                <Text bold>{item.role}</Text>
                <Text>{item.company}</Text>
              </Box>
              <Box flexDirection="column" alignItems="flex-end">
                <Text dimColor>{item.period}</Text>
                {item.location && <Text dimColor>{item.location}</Text>}
              </Box>
            </Box>
            <Box marginTop={1}>
              <Text wrap="wrap">{item.description}</Text>
            </Box>
          </Box>
        </CollapsibleSection>

        <CollapsibleSection
          id={SECTION_IDS[1]}
          index={1}
          title="stack"
          collapsed={Boolean(collapsed[SECTION_IDS[1]])}
          onToggle={toggleSection}
          onFocused={handleFocused}
          onPosition={() => {}}
          onHeaderPosition={() => {}}
          showIndex
        >
          <Box marginTop={1} marginLeft={2}>
            <Text dimColor wrap="wrap">{item.stack.join(" · ")}</Text>
          </Box>
        </CollapsibleSection>

        <CollapsibleSection
          id={SECTION_IDS[2]}
          index={2}
          title="highlights"
          collapsed={Boolean(collapsed[SECTION_IDS[2]])}
          onToggle={toggleSection}
          onFocused={handleFocused}
          onPosition={() => {}}
          onHeaderPosition={() => {}}
          showIndex
        >
          <Box marginTop={1} marginLeft={2} flexDirection="column">
            {item.highlights.map((highlight) => (
              <Text key={highlight}>· {highlight}</Text>
            ))}
          </Box>
        </CollapsibleSection>

        <PageFooter />
      </Box>
    </ScrollPageLayout>
  );
}
