import { Box, Text } from "ink";

import { experience } from "../data/experience.js";
import { theme } from "../theme.js";

export default function Experience() {
  return (
    <Box flexDirection="column">
      <Text bold color={theme.primary}>
        EXPERIENCE
      </Text>

      <Text> </Text>

      {experience.map((item) => (
        <Box
          key={`${item.company}-${item.role}`}
          flexDirection="column"
          marginBottom={1}
        >
          <Text bold>
            {item.role}
          </Text>

          <Text color={theme.secondary}>
            {item.company}
          </Text>

          <Text dimColor>
            {item.period}
            {item.location
              ? ` • ${item.location}`
              : ""}
          </Text>

          <Text> </Text>

          <Text>
            {item.description}
          </Text>

          <Text> </Text>

          <Text bold color={theme.primary}>
            STACK
          </Text>

          <Text dimColor>
            {item.stack.join(" • ")}
          </Text>

          <Text> </Text>

          <Text bold color={theme.primary}>
            HIGHLIGHTS
          </Text>

          {item.highlights.map(
            (highlight) => (
              <Text key={highlight}>
                • {highlight}
              </Text>
            )
          )}
        </Box>
      ))}
    </Box>
  );
}