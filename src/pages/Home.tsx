import { Box, Text } from "ink";

import Navigation from "../components/Navigation.js";

import { profile } from "../data/profile.js";
import { skills } from "../data/skills.js";
import { theme } from "../theme.js";

interface HomeProps {
  selectedIndex: number;
}

function Rule() {
  return <Text dimColor>{"─".repeat(56)}</Text>;
}

export default function Home({ selectedIndex }: HomeProps) {
  return (
    <Box flexDirection="column" width="100%">
      <Box
        width="100%"
        justifyContent="space-between"
        alignItems="center"
        paddingBottom={1}
      >
        <Box borderStyle="round" borderColor={theme.primary} paddingX={1}>
          <Text bold>PR</Text>
        </Box>

        <Navigation selectedIndex={selectedIndex} />

        <Box borderStyle="round" borderColor={theme.muted} paddingX={1}>
          <Text>◐</Text>
        </Box>
      </Box>

      <Rule />

      <Box marginTop={1} flexDirection="row" justifyContent="space-between" width="100%">
        <Box flexDirection="column" width="68%">
          <Text color={theme.primary}>● AVAILABLE FOR WORK</Text>
          <Text> </Text>
          <Text bold>PRITHVI RAJ</Text>
          <Text dimColor>{profile.title}</Text>
          <Text> </Text>
          <Text>{profile.tagline}</Text>
        </Box>

        <Box flexDirection="column" width="28%">
          <Text>{profile.location}</Text>
          <Text dimColor>India</Text>
        </Box>
      </Box>

      <Box marginTop={2} flexDirection="column">
        <Box flexDirection="row">
          <Text color={theme.primary}>▾ </Text>
          <Text bold>about</Text>
        </Box>
        <Rule />
        <Text> </Text>
        <Text>{profile.summary}</Text>
        <Text> </Text>
        <Text dimColor>
          Building products across web applications, developer tools, and AI-powered experiences.
        </Text>
      </Box>

      <Box marginTop={2} flexDirection="column">
        <Box flexDirection="row">
          <Text color={theme.primary}>▾ </Text>
          <Text bold>stack</Text>
        </Box>
        <Rule />
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

      <Box marginTop={2} flexDirection="column">
        <Box flexDirection="row">
          <Text color={theme.primary}>▾ </Text>
          <Text bold>highlights</Text>
        </Box>
        <Rule />
        <Text> </Text>
        {profile.highlights.map((highlight) => (
          <Text key={highlight}>· {highlight}</Text>
        ))}
      </Box>
    </Box>
  );
}
