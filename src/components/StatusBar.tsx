import { Box, Text } from "ink";
import { useEffect, useState } from "react";

function formatTime(date: Date) {
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).toLowerCase();
}

export default function StatusBar() {
  const [time, setTime] = useState(() => formatTime(new Date()));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(formatTime(new Date()));
    }, 30_000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Box
      width="100%"
      marginTop={1}
      paddingTop={1}
      borderStyle="single"
      borderColor="gray"
      justifyContent="space-between"
    >
      <Box>
        <Text dimColor>{time}</Text>
        <Text dimColor>  0%</Text>
      </Box>

      <Text dimColor>
        ↑↓ scroll  → section  ↵ fold  ←→ tabs  ^? shortcuts  q quit
      </Text>
    </Box>
  );
}
