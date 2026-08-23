import { Box, Text } from "ink";
import figlet from "figlet";

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
  scrollOffset: number;
  scrollMax: number;
}

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

export default function Home({ selectedIndex, scrollOffset, scrollMax }: HomeProps) {
  const { rows } = useTerminalSize();
  const currentRole = experience[0];
  const featuredProjects = projects.filter((project) => project.featured).slice(0, 2);
  const viewportHeight = Math.max(8, rows - 7);
  const progress = scrollMax === 0 ? 0 : Math.round((scrollOffset / scrollMax) * 100);

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
        maxOffset={scrollMax}
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
