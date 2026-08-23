import { Box, Text } from "ink";
import { useEffect, useState } from "react";

function formatTime(date: Date) {
  return date
    .toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase();
}

interface StatusBarProps {
  progress?: number;
}

export default function StatusBar({ progress = 0 }: StatusBarProps) {
  const [time, setTime] = useState(() => formatTime(new Date()));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(formatTime(new Date()));
    }, 30_000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Box width="100%" flexDirection="column" flexShrink={0}>
      <Text dimColor>{"─".repeat(96)}</Text>
      <Box width="100%" justifyContent="space-between">
        <Box>
          <Text dimColor>{time}</Text>
          <Text dimColor>  {progress}%</Text>
        </Box>
        <Text dimColor>
          ↑↓ scroll  → section  ↵ fold  ←→ tabs  ^? shortcuts  q quit
        </Text>
      </Box>
    </Box>
  );
}
