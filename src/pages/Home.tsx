import { Box, Text } from "ink";

import Navigation from "../components/Navigation.js";

import { profile } from "../data/profile.js";
import { skills } from "../data/skills.js";
import { theme } from "../theme.js";

interface HomeProps {
  selectedIndex: number;
}

export default function Home({
  selectedIndex,
}: HomeProps) {
  return (
    <Box flexDirection="column">
      <Text>
        {profile.summary}
      </Text>

      <Text> </Text>

      <Text bold color={theme.primary}>
        STACK
      </Text>

      <Text> </Text>

      {skills.map((group) => (
        <Text key={group.title}>
          <Text bold>
            {group.title}:{" "}
          </Text>

          <Text dimColor>
            {group.skills.join(" • ")}
          </Text>
        </Text>
      ))}

      <Text> </Text>

      <Text bold color={theme.primary}>
        HIGHLIGHTS
      </Text>

      <Text> </Text>

      {profile.highlights.map((highlight) => (
        <Text key={highlight}>
          • {highlight}
        </Text>
      ))}

      <Text> </Text>

      <Navigation
        selectedIndex={selectedIndex}
      />
    </Box>
  );
}