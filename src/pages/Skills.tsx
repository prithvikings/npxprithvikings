import { Box, Text } from "ink";

export default function Skills() {
  return (
    <Box flexDirection="column">
      <Text bold>SKILLS</Text>

      <Text> </Text>

      <Text>Frontend</Text>
      <Text dimColor>
        React • Next.js • React Native • Tailwind CSS
      </Text>

      <Text> </Text>

      <Text>Backend</Text>
      <Text dimColor>
        Node.js • Express • NestJS • MongoDB • Redis
      </Text>

      <Text> </Text>

      <Text>Infrastructure</Text>
      <Text dimColor>
        Docker • Nginx • AWS • Linux • CI/CD
      </Text>
    </Box>
  );
}