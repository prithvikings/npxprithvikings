import { Box, Text } from "ink";

import { profile } from "../data/profile.js";

export default function About() {
  return (
    <Box flexDirection="column">
      <Text bold>ABOUT</Text>

      <Text> </Text>

      <Text>
        {profile.summary}
      </Text>

      <Text> </Text>

      <Text>
        Location: {profile.location}
      </Text>

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