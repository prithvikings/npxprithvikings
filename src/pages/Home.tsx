import { Box, Text } from "ink";

import { profile } from "../data/profile.js";
import { skills } from "../data/skills.js";

export default function Home() {
  return (
    <Box flexDirection="column">
      <Text bold>
        {profile.name}
      </Text>

      <Text>
        {profile.title}
      </Text>

      <Text dimColor>
        {profile.tagline}
      </Text>

      <Text> </Text>

      <Text bold>SKILLS</Text>

      <Text> </Text>

      {skills.map((group) => (
        <Box key={group.title}>
          <Text>
            <Text bold>
              {group.title}:{" "}
            </Text>

            <Text dimColor>
              {group.skills.join(" • ")}
            </Text>
          </Text>
        </Box>
      ))}

      <Text> </Text>

      <Text bold>HIGHLIGHTS</Text>

      <Text> </Text>

      {profile.highlights.map((highlight) => (
        <Text key={highlight}>
          • {highlight}
        </Text>
      ))}
    </Box>
  );
}