import { Box, Text, useFocusManager, useInput } from "ink";
import { useCallback, useState } from "react";

import CollapsibleSection from "../components/CollapsibleSection.js";
import PageFooter from "../components/PageFooter.js";
import ScrollPageLayout from "../components/ScrollPageLayout.js";
import TerminalLink from "../components/TerminalLink.js";
import { projects } from "../data/projects.js";

interface ProjectsProps {
  onNavigate: (page: string, index: number) => void;
  selectedIndex: number;
}

const SECTION_IDS = projects.map((project) => `project-section-${project.id}`);

export default function Projects({ onNavigate, selectedIndex }: ProjectsProps) {
  const { focus } = useFocusManager();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [focusedSection, setFocusedSection] = useState(SECTION_IDS[0]);

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

  return (
    <ScrollPageLayout
      activePage="projects"
      selectedIndex={selectedIndex}
      onNavigate={onNavigate}
    >
      <Box flexDirection="column" paddingX={2}>
        {projects.map((project, index) => {
          const sectionId = SECTION_IDS[index];

          return (
            <CollapsibleSection
              key={project.id}
              id={sectionId}
              index={index}
              title={project.name}
              collapsed={Boolean(collapsed[sectionId])}
              onToggle={toggleSection}
              onFocused={handleFocused}
              onPosition={() => {}}
              onHeaderPosition={() => {}}
              showIndex
            >
              <Box marginTop={1} marginLeft={2} flexDirection="column">
                <Text wrap="wrap">{project.description}</Text>
                <Text> </Text>
                <Text dimColor wrap="wrap">{project.stack.join(" · ")}</Text>
                <Text> </Text>
                <Box flexDirection="row" gap={2}>
                  {project.links.demo && <TerminalLink url={project.links.demo}>[ live ↗ ]</TerminalLink>}
                  {project.links.github && <TerminalLink url={project.links.github}>[ code ↗ ]</TerminalLink>}
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
