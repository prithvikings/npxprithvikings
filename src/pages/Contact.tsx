import { Box, Text } from "ink";

import { contact } from "../data/contact.js";
import { theme } from "../theme.js";

export default function Contact() {
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

      <Text bold>GitHub</Text>
      <Text dimColor>
        {contact.github}
      </Text>

      <Text> </Text>

      <Text bold>LinkedIn</Text>
      <Text dimColor>
        {contact.linkedin}
      </Text>

      <Text> </Text>

      <Text bold>Website</Text>
      <Text dimColor>
        {contact.website}
      </Text>
    </Box>
  );
}