import { Box } from "ink";
import type { ReactNode } from "react";

import Header from "./Header.js";
import StatusBar from "./StatusBar.js";

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
        {showHeader && <Header />}
        {showHeader && <Box marginTop={0} />}

        {children}

        {footer ? <StatusBar /> : null}
      </Box>
    </Box>
  );
}
