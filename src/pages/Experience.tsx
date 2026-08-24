import { Box, Text } from "ink";

import ScrollPageLayout from "../components/ScrollPageLayout.js";
import { experience } from "../data/experience.js";

interface ExperienceProps {
  selectedIndex?: number;
  onNavigate?: (page: string, index: number) => void;
}

function RuleTitle({ index, title }: { index: string; title: string }) {
  return (
    <Box width="100%" flexDirection="row" alignItems="center">
      <Text bold>{index}  {title}</Text>
      <Box flexGrow={1} marginLeft={1}>
        <Text dimColor>{"─".repeat(80)}</Text>
      </Box>
    </Box>
  );
}

export default function Experience({ selectedIndex = 2, onNavigate = () => {} }: ExperienceProps) {
  return (
    <ScrollPageLayout
      activePage="experience"
      selectedIndex={selectedIndex}
      onNavigate={onNavigate}
    >
      <Box flexDirection="column" paddingX={2}>
        <Box marginBottom={1}>
          <RuleTitle index="01" title="experience" />
        </Box>

        {experience.map((item, index) => (
          <Box key={`${item.company}-${item.role}`} flexDirection="column" marginLeft={2} marginBottom={2}>
            <Box width="100%" flexDirection="row" justifyContent="space-between">
              <Box flexDirection="column">
                <Text bold>{item.role}</Text>
                <Text>{item.company}</Text>
              </Box>
              <Box flexDirection="column" alignItems="flex-end">
                <Text dimColor>{item.period}</Text>
                {item.location && <Text dimColor>{item.location}</Text>}
              </Box>
            </Box>

            <Box marginTop={1}>
              <Text wrap="wrap">{item.description}</Text>
            </Box>

            <Box marginTop={1} marginBottom={1}>
              <RuleTitle index={String(index + 2).padStart(2, "0")} title="stack" />
            </Box>
            <Box marginLeft={2}>
              <Text dimColor wrap="wrap">{item.stack.join(" · ")}</Text>
            </Box>

            <Box marginTop={1} marginBottom={1}>
              <RuleTitle index={String(index + 3).padStart(2, "0")} title="highlights" />
            </Box>
            <Box marginLeft={2} flexDirection="column">
              {item.highlights.map((highlight) => (
                <Text key={highlight}>· {highlight}</Text>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </ScrollPageLayout>
  );
}
