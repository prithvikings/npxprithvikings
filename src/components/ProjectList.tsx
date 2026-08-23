import { Box, Text } from "ink";

import { projects } from "../data/projects.js";

interface ProjectListProps {
  selectedIndex: number;
}

export default function ProjectList({
  selectedIndex,
}: ProjectListProps) {
  return (
    <Box flexDirection="column">
      {projects.map((project, index) => (
        <Text key={project.id}>
          {index === selectedIndex
            ? "❯ "
            : "  "}
          {project.name}
        </Text>
      ))}
    </Box>
  );
}