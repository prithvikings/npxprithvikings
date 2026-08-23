import { Box, Text } from "ink";

import { contactLinks } from "../data/contactLinks.js";
import { theme } from "../theme.js";
import TerminalLink from "../components/TerminalLink.js";

interface ContactProps {
  selectedContactIndex: number;
}

export default function Contact({
  selectedContactIndex,
}: ContactProps) {
  return (
    <Box flexDirection="column">
      <Text bold color={theme.primary}>
        CONTACT
      </Text>

      <Text> </Text>

      <Text>
        Want to build something together?
      </Text>

      <Text> </Text>

      {contactLinks.map((link, index) => {
        const selected =
          index === selectedContactIndex;

        return (
          <Box
            key={link.label}
            flexDirection="column"
            marginBottom={1}
          >
            <Text
              bold={selected}
              color={
                selected
                  ? theme.primary
                  : undefined
              }
            >
              {selected ? "❯ " : "  "}
              {link.label}
            </Text>

            <Text dimColor>
  {"   "}
  <TerminalLink
    url={link.url}
  >
    {link.url}
  </TerminalLink>
</Text>
          </Box>
        );
      })}
    </Box>
  );
}