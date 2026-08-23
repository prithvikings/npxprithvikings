import { Box, Text } from "ink";
import figlet from "figlet";

import Navigation from "../components/Navigation.js";
import { profile } from "../data/profile.js";
import { skills } from "../data/skills.js";
import { experience } from "../data/experience.js";
import { theme } from "../theme.js";

interface HomeProps {
  selectedIndex: number;
}

const nameArt = figlet.textSync("PRITHVI", {
  font: "ANSI Shadow",
  horizontalLayout: "default",
  verticalLayout: "default",
});

function SectionTitle({ title }: { title: string }) {
  return (
    <Box flexDirection="row" width="100%">
      <Text color={theme.primary}>▾ </Text>
      <Text bold>{title}</Text>
      <Text dimColor> {"─".repeat(Math.max(4, 76 - title.length))}</Text>
    </Box>
  );
}

export default function Home({ selectedIndex }: HomeProps) {
  const currentRole = experience[0];

  return (
    <Box width="100%" flexDirection="column" paddingBottom={1}>
      <Box width="100%" justifyContent="space-between" alignItems="center">
        <Box borderStyle="round" borderColor={theme.muted} paddingX={1}>
          <Text bold>PR</Text>
        </Box>

        <Box flexDirection="row" gap={1}>
          <Navigation selectedIndex={selectedIndex} activePage="home" />
          <Box borderStyle="round" borderColor={theme.muted} paddingX={1}>
            <Text>◐</Text>
          </Box>
        </Box>
      </Box>

      <Text dimColor>{"─".repeat(84)}</Text>

      <Box width="100%" alignItems="flex-start">
        <Text bold color={theme.primary}>{nameArt}</Text>
      </Box>

      <Box width="100%" justifyContent="space-between" marginTop={0}>
        <Box flexDirection="column" width="72%">
          <Text bold>{profile.title}</Text>
          <Text dimColor>{profile.tagline}</Text>
        </Box>

        <Box flexDirection="column" width="24%">
          <Text color={theme.primary}>● AVAILABLE</Text>
          <Text>{profile.location}</Text>
        </Box>
      </Box>

      <Box marginTop={1} flexDirection="column">
        <SectionTitle title="about" />
        <Text> </Text>
        <Text>{profile.summary}</Text>
        <Text> </Text>
        <Text dimColor>
          I enjoy turning product ideas into reliable systems, from clean interfaces and APIs to the infrastructure that keeps them fast.
        </Text>
      </Box>

      <Box marginTop={1} flexDirection="column">
        <SectionTitle title="experience" />
        <Text> </Text>
        <Box justifyContent="space-between">
          <Text bold>{currentRole.company}</Text>
          <Text dimColor>{currentRole.period}</Text>
        </Box>
        <Box justifyContent="space-between">
          <Text dimColor>{currentRole.role}</Text>
          <Text dimColor>{currentRole.location}</Text>
        </Box>
        <Text> </Text>
        <Text>{currentRole.description}</Text>
        <Text> </Text>
        {currentRole.highlights.map((highlight) => (
          <Text key={highlight} dimColor>· {highlight}</Text>
        ))}
      </Box>

      <Box marginTop={1} flexDirection="column">
        <SectionTitle title="stack" />
        <Text> </Text>
        {skills.map((group) => (
          <Box key={group.title} flexDirection="row">
            <Box width={16}>
              <Text dimColor>{group.title.toLowerCase()}</Text>
            </Box>
            <Text>{group.skills.join(" · ")}</Text>
          </Box>
        ))}
      </Box>

      <Box marginTop={1} flexDirection="column">
        <SectionTitle title="highlights" />
        <Text> </Text>
        {profile.highlights.map((highlight) => (
          <Text key={highlight}>· {highlight}</Text>
        ))}
      </Box>
    </Box>
  );
}
