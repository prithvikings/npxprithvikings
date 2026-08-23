import { Box, Text } from "ink";

import { profile } from "../data/profile.js";
import { theme } from "../theme.js";

export default function Header() {
  return (
    <Box flexDirection="column">
      <Text bold color={theme.primary}>
        PRITHVI RAJ
      </Text>

      <Text color={theme.secondary}>
        {profile.title}
      </Text>

      <Text dimColor>
        {profile.tagline}
      </Text>
    </Box>
  );
}