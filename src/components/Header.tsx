import { Box, Text } from "ink";

export default function Header() {
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Text bold>
        PRITHVI RAJ
      </Text>

      <Text>
        Full Stack Developer
      </Text>

      <Text dimColor>
        Building products, solving problems, breaking things.
      </Text>
    </Box>
  );
}