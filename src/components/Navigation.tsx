import { Box, Text } from "ink";

import { navigationItems } from "../data/navigation.js";
import { theme } from "../theme.js";

interface NavigationProps {
  selectedIndex: number;
}

export default function Navigation({
  selectedIndex,
}: NavigationProps) {
  return (
    <Box flexDirection="column">
      <Text bold>
        NAVIGATION
      </Text>

      <Text> </Text>

      {navigationItems.map((item, index) => {
        const selected = index === selectedIndex;

        return (
          <Text
            key={item.page}
            color={
              selected
                ? theme.primary
                : undefined
            }
            bold={selected}
          >
            {selected ? "❯ " : "  "}
            {item.label}
          </Text>
        );
      })}
    </Box>
  );
}