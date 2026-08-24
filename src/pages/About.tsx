import { Box, Text } from "ink";

import ScrollPageLayout from "../components/ScrollPageLayout.js";
import { profile } from "../data/profile.js";
import { skills } from "../data/skills.js";
import { theme } from "../theme.js";

interface AboutProps {
  selectedIndex?: number;
  onNavigate?: (page: string, index: number) => void;
}

function RuleTitle({ index, title }: { index: string; title: string }) {
  return (
    <Box width="100%" flexDirection="row" alignItems="center">
      <Text bold>{index}  {title}</Text>
      <Box flexGrow={1} marginLeft={1}>
        <Text dimColor wrap="truncate">{"─".repeat(120)}</Text>
      </Box>
    </Box>
  );
}

export default function About({ selectedIndex = 1, onNavigate = () => {} }: AboutProps) {
  return (
    <ScrollPageLayout
      activePage="about"
      selectedIndex={selectedIndex}
      onNavigate={onNavigate}
    >
      <Box flexDirection="column" paddingX={2}>
        <Box marginBottom={1}>
          <RuleTitle index="01" title="about" />
        </Box>
        <Box marginLeft={2} flexDirection="column">
          <Text wrap="wrap">{profile.summary}</Text>
          <Text> </Text>
          {profile.about.map((paragraph) => (
            <Box key={paragraph} marginBottom={1}>
              <Text dimColor wrap="wrap">{paragraph}</Text>
            </Box>
          ))}
        </Box>

        <Box marginTop={1} marginBottom={1}>
          <RuleTitle index="02" title="focus" />
        </Box>
        <Box marginLeft={2} flexDirection="column">
          {[
            "Full-stack web development",
            "Backend architecture",
            "Developer tooling",
            "AI-powered applications",
          ].map((item) => (
            <Text key={item}>· {item}</Text>
          ))}
        </Box>

        <Box marginTop={1} marginBottom={1}>
          <RuleTitle index="03" title="core stack" />
        </Box>
        <Box marginLeft={2} flexDirection="column">
          {skills.map((group) => (
            <Text key={group.title} wrap="wrap">
              <Text bold>{group.title}: </Text>
              <Text dimColor>{group.skills.join(" · ")}</Text>
            </Text>
          ))}
        </Box>

        <Box marginTop={1} marginBottom={1}>
          <RuleTitle index="04" title="highlights" />
        </Box>
        <Box marginLeft={2} flexDirection="column">
          {profile.highlights.map((highlight) => (
            <Text key={highlight}>· {highlight}</Text>
          ))}
        </Box>

        <Box marginTop={2}>
          <Text color={theme.primary} dimColor>
            profile / developer / builder
          </Text>
        </Box>
      </Box>
    </ScrollPageLayout>
  );
}
