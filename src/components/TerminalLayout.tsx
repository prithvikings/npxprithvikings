import { Box, Text } from "ink";
import type { ReactNode } from "react";

import Header from "./Header.js";
import { theme } from "../theme.js";

interface TerminalLayoutProps {
  children: ReactNode;
  footer?: string;
}

export default function TerminalLayout({
  children,
  footer,
}: TerminalLayoutProps) {
  return (
    <Box
      flexDirection="column"
      padding={1}
      borderStyle="round"
      borderColor={theme.primary}
    >
      <Header />

      <Text> </Text>

      {children}

      {footer && (
        <>
          <Text> </Text>

          <Text dimColor>
            {footer}
          </Text>
        </>
      )}
    </Box>
  );
}