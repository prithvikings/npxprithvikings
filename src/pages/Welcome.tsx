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
const SHINE_INTERVAL = 4000;
const SHINE_DURATION = 900;
const SHINE_COLOR = "#FFF7ED";

export default function Welcome() {
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [shineProgress, setShineProgress] = useState(-1);

  useEffect(() => {
    const interval = setInterval(() => {
      setGreetingIndex((current) =>
        (current + 1) % greetings.length,
      );
    }, GREETING_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    let animation: ReturnType<typeof setInterval>;

    const startShine = () => {
      const startedAt = Date.now();

      setShineProgress(0);

      animation = setInterval(() => {
        const elapsed = Date.now() - startedAt;
        const progress = Math.min(
          elapsed / SHINE_DURATION,
          1,
        );

        setShineProgress(progress);

        if (progress >= 1) {
          clearInterval(animation);
          setShineProgress(-1);
          timeout = setTimeout(startShine, SHINE_INTERVAL);
        }
      }, 40);
    };

    timeout = setTimeout(startShine, 1200);

    return () => {
      clearTimeout(timeout);
      clearInterval(animation);
    };
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

  const nameLines = nameArt.split("\n").filter(
    (line, index, lines) =>
      index !== lines.length - 1 || line.length > 0,
  );

  const nameWidth = Math.max(
    ...nameLines.map((line) => line.length),
  );

  const terminalHeight = Math.max(
    (process.stdout.rows ?? 24) - 1,
    12,
  );

  const renderName = () => {
    if (shineProgress < 0) {
      return <Text bold color={theme.primary}>{nameArt}</Text>;
    }

    const shinePosition =
      -nameLines.length +
      shineProgress * (nameWidth + nameLines.length);

    return (
      <Box flexDirection="column">
        {nameLines.map((line, row) => (
          <Text key={row} bold>
            {Array.from(line).map((character, column) => {
              if (character === " ") {
                return <Text key={column}> </Text>;
              }

              const distance = Math.abs(
                row + column - shinePosition,
              );

              return (
                <Text
                  key={column}
                  color={
                    distance <= 1.25
                      ? SHINE_COLOR
                      : theme.primary
                  }
                >
                  {character}
                </Text>
              );
            })}
          </Text>
        ))}
      </Box>
    );
  };

  return (
    <Box
      width="100%"
      height={terminalHeight}
      flexDirection="column"
      paddingX={2}
    >
      <Box
        flexGrow={1}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        {renderName()}

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
