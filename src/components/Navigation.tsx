import { Box, Text } from "ink";

import { navigationItems } from "../data/navigation.js";
import { theme } from "../theme.js";

interface NavigationProps {
  selectedIndex: number;
  activePage?: string;
}

export default function Navigation({
  selectedIndex,
  activePage,
}: NavigationProps) {
  return (
    <Box flexDirection="row" gap={1}>
      {navigationItems.map((item, index) => {
        const selected = activePage
          ? item.page === activePage
          : index === selectedIndex;

        return (
          <Box
            key={item.page}
            borderStyle="round"
            borderColor={
              selected ? theme.primary : theme.muted
            }
            paddingX={1}
          >
            <Text
              bold={selected}
              color={selected ? theme.primary : undefined}
            >
              {item.label}
            </Text>
          </Box>
        );
      })}
    </Box>
  );
}
