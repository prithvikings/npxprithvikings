import { Box, Text } from "ink";

import { navigationItems } from "../data/navigation.js";

interface NavigationProps {
  selectedIndex: number;
}

export default function Navigation({
  selectedIndex,
}: NavigationProps) {
  return (
    <Box flexDirection="column">
      {navigationItems.map((item, index) => (
        <Text key={item.page}>
          {index === selectedIndex ? "❯ " : "  "}
          {item.label}
        </Text>
      ))}
    </Box>
  );
}