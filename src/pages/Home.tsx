import { Box, Text } from "ink";
import figlet from "figlet";

import Navigation from "../components/Navigation.js";
import { profile } from "../data/profile.js";
import { skills } from "../data/skills.js";
import { theme } from "../theme.js";

interface HomeProps {
  selectedIndex: number;
}

const nameArt = figlet.textSync("PRITHVI", {
  font: "ANSI Shadow",
  horizontalLayout: "default",
  verticalLayout: "default",
});

function Rule() {
  return (
    <Text dimColor>{"─".repeat(104)}</Text>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <Box flexDirection="row" width="100%">
      <Text color={theme.primary}>▾ </Text>
      <Text bold>{title}</Text>
      <Text dimColor> {"─".repeat(Math.max(4, 92 - title.length))}</Text>
    </Box>
  );
}

export default function Home({ selectedIndex }: HomeProps) {
  return (
    <Box
      width="100%"
      flexDirection="column"
      paddingBottom={1}
    >
      <Box
        width="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box
          borderStyle="round"
          borderColor={theme.muted}
          paddingX={1}
        >
          <Text bold>PR</Text>
        </Box>

        <Navigation
          selectedIndex={selectedIndex}
          activePage="home"
        />

        <Box
          borderStyle="round"
          borderColor={theme.muted}
          paddingX={1}
        >
          <Text>◐</Text>
        </Box>
      </Box>

      <Box marginTop={1}>
        <Rule />
      </Box>

      <Box
        width="100%"
        alignItems="center"
        marginTop={1}
      >
        <Text bold color={theme.primary}>
          {nameArt}
        </Text>
      </Box>

      <Box
        width="100%"
        justifyContent="space-between"
        marginTop={1}
      >
        <Box flexDirection="column" width="68%">
          <Text bold>{profile.title}</Text>
          <Text dimColor>{profile.tagline}</Text>
        </Box>

        <Box flexDirection="column" width="28%">
          <Text color={theme.primary}>● AVAILABLE</Text>
          <Text>{profile.location}</Text>
        </Box>
      </Box>

      <Box marginTop={2} flexDirection="column">
        <SectionTitle title="about" />
        <Text> </Text>
        <Text>{profile.summary}</Text>
        <Text> </Text>
        <Text dimColor>
          Building products across web applications, developer tools, and AI-powered experiences.
        </Text>
      </Box>

      <Box marginTop={2} flexDirection="column">
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

      <Box marginTop={2} flexDirection="column">
        <SectionTitle title="highlights" />
        <Text> </Text>
        {profile.highlights.map((highlight) => (
          <Text key={highlight}>· {highlight}</Text>
        ))}
      </Box>
    </Box>
  );
}
