import { Box, Text } from "ink";
import { useEffect, useMemo, useState } from "react";
import figlet from "figlet";

import { theme } from "../theme.js";

const greetings = [
  "Hello",
  "Hola",
  "Bonjour",
  "Namaste",
];

const GREETING_INTERVAL = 900;

export default function Welcome() {
  const [greetingIndex, setGreetingIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setGreetingIndex((current) =>
        (current + 1) % greetings.length,
      );
    }, GREETING_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const nameArt = useMemo(
    () =>
      figlet.textSync("PRITHVI", {
        font: "ANSI Shadow",
        horizontalLayout: "default",
        verticalLayout: "default",
      }),
    [],
  );

  return (
    <Box
      width="100%"
      height="100%"
      flexDirection="column"
      paddingX={2}
    >
      <Box
        flexGrow={1}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Text bold color={theme.primary}>
          {nameArt}
        </Text>

        <Box marginTop={1} height={1}>
          <Text bold>
            {greetings[greetingIndex]}
          </Text>
        </Box>

        <Box marginTop={2}>
          <Text dimColor>
            A curious builder exploring and turning ideas into reality.
          </Text>
        </Box>

        <Box
          marginTop={2}
          borderStyle="round"
          borderColor={theme.primary}
          paddingX={2}
          paddingY={0}
        >
          <Text bold>↵ Enter</Text>
        </Box>

        <Box marginTop={1}>
          <Text dimColor>
            Press Enter to continue
          </Text>
        </Box>
      </Box>

      <Box justifyContent="center">
        <Text dimColor>
          Built with love, LLMs and patience.
        </Text>
      </Box>
    </Box>
  );
}
