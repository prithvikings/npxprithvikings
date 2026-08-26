import { Box, Text, useFocusManager, useInput } from "ink";
import { useCallback, useMemo, useState } from "react";

import CollapsibleSection from "../components/CollapsibleSection.js";
import PageFooter from "../components/PageFooter.js";
import ScrollPageLayout from "../components/ScrollPageLayout.js";
import { experience } from "../data/experience.js";

interface ExperienceProps {
  selectedIndex?: number;
  onNavigate?: (page: string, index: number) => void;
}

export default function Experience({ selectedIndex = 2, onNavigate = () => {} }: ExperienceProps) {
  const { focus } = useFocusManager();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [focusedSection, setFocusedSection] = useState("");

  const sectionIds = useMemo(
    () => experience.map((_, index) => `experience-section-${index}`),
    [],
  );

  const toggleSection = useCallback((id: string) => {
    setCollapsed((current) => ({ ...current, [id]: !current[id] }));
  }, []);

  const handleFocused = useCallback((id: string) => {
    setFocusedSection(id);
  }, []);

  useInput((_, key) => {
    if (!key.tab || sectionIds.length === 0) return;

    const currentIndex = Math.max(0, sectionIds.indexOf(focusedSection));
    const nextIndex = key.shift
      ? (currentIndex - 1 + sectionIds.length) % sectionIds.length
      : (currentIndex + 1) % sectionIds.length;

    focus(sectionIds[nextIndex]);
  });

  if (experience.length === 0) return null;

  return (
    <ScrollPageLayout
      activePage="experience"
      selectedIndex={selectedIndex}
      onNavigate={onNavigate}
    >
      <Box flexDirection="column" paddingX={2}>
        {experience.map((item, index) => {
          const sectionId = sectionIds[index];

          return (
            <CollapsibleSection
              key={sectionId}
              id={sectionId}
              index={index}
              title={item.company}
              collapsed={Boolean(collapsed[sectionId])}
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
                  </Box>
                  <Box flexDirection="column" alignItems="flex-end">
                    <Text dimColor>{item.period}</Text>
                    {item.location && <Text dimColor>{item.location}</Text>}
                  </Box>
                </Box>

                <Box marginTop={1}>
                  <Text wrap="wrap">{item.description}</Text>
                </Box>

                <Box marginTop={1}>
                  <Text dimColor>{item.stack.join(" · ")}</Text>
                </Box>

                <Box marginTop={1} flexDirection="column">
                  {item.highlights.map((highlight) => (
                    <Text key={highlight}>· {highlight}</Text>
                  ))}
                </Box>
              </Box>
            </CollapsibleSection>
          );
        })}

        <PageFooter />
      </Box>
    </ScrollPageLayout>
  );
}
