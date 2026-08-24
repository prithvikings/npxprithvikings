import { Box, Text } from "ink";

import { theme } from "../theme.js";

export default function PageFooter() {
  return (
    <Box flexDirection="column">
      <Box marginTop={2} paddingX={1} borderStyle="round" borderColor={theme.muted} flexDirection="column">
        <Text dimColor>“I was not born with a whole lot of natural talent... but I</Text>
        <Text dimColor>work hard and I never give up.”</Text>
        <Box justifyContent="flex-end">
          <Text dimColor>— Rock Lee</Text>
        </Box>
      </Box>
      <Box marginTop={2} flexDirection="column" alignItems="center">
        <Text dimColor>© {new Date().getFullYear()} @prithvikings</Text>
        <Text dimColor>Built with love, LLMs and patience.</Text>
      </Box>
    </Box>
  );
}
