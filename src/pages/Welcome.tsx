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

const TYPE_SPEED = 85;
const DELETE_SPEED = 45;
const HOLD_AFTER_TYPE = 650;
const SHINE_INTERVAL = 2500;
const SHINE_DURATION = 700;
const SHINE_COLOR = "#FFF7ED";

interface WelcomeProps {
  onContinue: () => void;
}

export default function Welcome({ onContinue }: WelcomeProps) {
  const [greetingText, setGreetingText] = useState("");
  const [shineProgress, setShineProgress] = useState(-1);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout>;

    const typeGreeting = (index: number) => {
      const greeting = greetings[index];
      let characterIndex = 0;

      const typeNext = () => {
        if (cancelled) return;

        if (characterIndex < greeting.length) {
          characterIndex += 1;
          setGreetingText(greeting.slice(0, characterIndex));
          timeout = setTimeout(typeNext, TYPE_SPEED);
          return;
        }

        timeout = setTimeout(deleteNext, HOLD_AFTER_TYPE);
      };

      const deleteNext = () => {
        if (cancelled) return;

        if (characterIndex > 0) {
          characterIndex -= 1;
          setGreetingText(greeting.slice(0, characterIndex));
          timeout = setTimeout(deleteNext, DELETE_SPEED);
          return;
        }

        typeGreeting((index + 1) % greetings.length);
      };

      typeNext();
    };

    typeGreeting(0);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
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
      }, 35);
    };

    timeout = setTimeout(startShine, 700);

    return () => {
      clearTimeout(timeout);
      clearInterval(animation);
    };
  }, []);

  useEffect(() => {
    const stdin = process.stdin;
    const stdout = process.stdout;

    if (!stdin.isTTY || !stdout.isTTY) {
      return;
    }

    const columns = stdout.columns ?? 80;
    const terminalHeight = Math.max(
      (stdout.rows ?? 24) - 1,
      12,
    );

    stdout.write("\x1b[?1003h\x1b[?1006h");

    const nameArt = figlet.textSync("PRITHVI", {
      font: "ANSI Shadow",
      horizontalLayout: "default",
      verticalLayout: "default",
    });

    const nameLines = nameArt.split("\n").filter(
      (line, index, lines) =>
        index !== lines.length - 1 || line.length > 0,
    );

    const nameHeight = nameLines.length;
    const contentHeight = nameHeight + 16;
    const contentTop = Math.max(
      1,
      Math.floor((terminalHeight - contentHeight) / 2) + 1,
    );

    const buttonTop = contentTop + nameHeight + 7;
    const buttonHeight = 3;
    const buttonWidth = 13;
    const buttonLeft = Math.floor(
      (columns - buttonWidth) / 2,
    ) + 1;

    const handleMouse = (chunk: Buffer | string) => {
      const data = chunk.toString();
      const matches = data.matchAll(
        /\x1b\[<(\d+);(\d+);(\d+)([Mm])/g,
      );

      for (const match of matches) {
        const x = Number(match[2]);
        const y = Number(match[3]);
        const action = match[4];

        const insideButton =
          x >= buttonLeft - 1 &&
          x <= buttonLeft + buttonWidth &&
          y >= buttonTop &&
          y <= buttonTop + buttonHeight - 1;

        setIsButtonHovered(insideButton);

        if (action === "M" && insideButton) {
          onContinue();
        }
      }
    };

    stdin.on("data", handleMouse);

    return () => {
      stdin.off("data", handleMouse);
      stdout.write("\x1b[?1003l\x1b[?1006l");
    };
  }, [onContinue]);

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
            {greetingText || " "}
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
          borderColor={
            isButtonHovered ? SHINE_COLOR : theme.primary
          }
          paddingX={2}
          paddingY={0}
        >
          <Text bold>↵ Enter</Text>
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
