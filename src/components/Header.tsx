import { Box, Text } from "ink";

import { theme } from "../theme.js";

export default function Header() {
  return (
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

      <Text dimColor>terminal portfolio</Text>

      <Box
        borderStyle="round"
        borderColor={theme.muted}
        paddingX={1}
      >
        <Text>◐</Text>
      </Box>
    </Box>
  );
}
