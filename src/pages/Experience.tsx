import { Box, Text } from "ink";

import { experience } from "../data/experience.js";

export default function Experience() {
  return (
    <Box flexDirection="column">
      <Text bold>EXPERIENCE</Text>

      <Text> </Text>

      {experience.map((job) => (
        <Box
          key={`${job.company}-${job.period}`}
          flexDirection="column"
          marginBottom={1}
        >
          <Text bold>
            {job.role} — {job.company}
          </Text>

          <Text dimColor>
            {job.period}
            {job.location
              ? ` • ${job.location}`
              : ""}
          </Text>

          <Text> </Text>

          <Text>
            {job.description}
          </Text>

          <Text> </Text>

          <Text>
            <Text bold>Stack: </Text>
            {job.stack.join(" • ")}
          </Text>

          <Text> </Text>

          {job.highlights.map((highlight) => (
            <Text key={highlight}>
              • {highlight}
            </Text>
          ))}
        </Box>
      ))}
    </Box>
  );
}