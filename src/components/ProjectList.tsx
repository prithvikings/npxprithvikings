import { Box, Text } from "ink";

import { projects } from "../data/projects.js";
import { theme } from "../theme.js";

interface ProjectListProps {
  selectedIndex: number;
}

export default function ProjectList({
  selectedIndex,
}: ProjectListProps) {
  return (
    <Box flexDirection="column">
      {projects.map((project, index) => {
        const selected = index === selectedIndex;

        return (
          <Box
            key={project.id}
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
              {project.name}
              {project.featured
                ? " ★"
                : ""}
            </Text>

            <Text dimColor>
              {selected ? "   " : "   "}
              {project.shortDescription}
            </Text>
          </Box>
        );
      })}
    </Box>
  );
}