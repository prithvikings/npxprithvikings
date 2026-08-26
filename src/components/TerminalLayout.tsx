import { Box, Text } from "ink";
import type { ReactNode } from "react";

import StatusBar from "./StatusBar.js";
import { theme } from "../theme.js";

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
  const terminalWidth = process.stdout.columns ?? 118;
  const contentWidth = Math.min(Math.max(70, terminalWidth - 24), 100);

  return (
    <Box width="100%" flexDirection="column" alignItems="center">
      <Box width={contentWidth} flexDirection="column" paddingX={1}>
        {showHeader && (
          <Box width="100%" justifyContent="space-between" alignItems="center">
            <Box borderStyle="round" borderColor={theme.muted} paddingX={1}>
              <Text bold>PR</Text>
            </Box>
            <Text dimColor>terminal portfolio</Text>
          </Box>
        )}
        {showHeader && <Box marginTop={0} />}

        {children}

        {footer ? <StatusBar /> : null}
      </Box>
    </Box>
  );
}
