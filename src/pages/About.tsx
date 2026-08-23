import { Box, Text } from "ink";

import { profile } from "../data/profile.js";
import { skills } from "../data/skills.js";
import { theme } from "../theme.js";

export default function About() {
  return (
    <Box flexDirection="column">
      <Text bold color={theme.primary}>
        ABOUT
      </Text>

      <Text> </Text>

      <Text>
        {profile.summary}
      </Text>

      <Text> </Text>

      <Text bold color={theme.primary}>
        FOCUS
      </Text>

      <Text> </Text>

      <Text>• Full-stack web development</Text>
      <Text>• Backend architecture</Text>
      <Text>• Developer tooling</Text>
      <Text>• AI-powered applications</Text>

      <Text> </Text>

      <Text bold color={theme.primary}>
        LOCATION
      </Text>

      <Text> </Text>

      <Text dimColor>
        {profile.location}
      </Text>

      <Text> </Text>

      <Text bold color={theme.primary}>
        CORE STACK
      </Text>

      <Text> </Text>

      {skills.slice(0, 3).map((group) => (
        <Text key={group.title}>
          <Text bold>
            {group.title}:{" "}
          </Text>

          <Text dimColor>
            {group.skills.join(" • ")}
          </Text>
        </Text>
      ))}
    </Box>
  );
}