import { Box, Text } from "ink";
import type { ReactNode } from "react";

import Header from "./Header.js";

interface TerminalLayoutProps {
  children: ReactNode;
  footer?: string;
  showHeader?: boolean;
}

export default function TerminalLayout({
  children,
  footer,
  showHeader = true,
}: TerminalLayoutProps) {
  return (
    <Box
      width="100%"
      flexDirection="column"
      alignItems="center"
    >
      <Box
        width="100%"
        maxWidth={118}
        flexDirection="column"
        paddingX={2}
      >
        {showHeader && <Header />}
        {showHeader && <Text> </Text>}

        {children}

        {footer && (
          <Box
            width="100%"
            marginTop={1}
            paddingTop={1}
            borderStyle="single"
            borderColor="gray"
          >
            <Text dimColor>{footer}</Text>
          </Box>
        )}
      </Box>
    </Box>
  );
}
