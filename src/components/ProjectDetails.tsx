import { Box, Text } from "ink";

import type { Project } from "../data/projects.js";

interface ProjectDetailsProps {
  project: Project;
}

export default function ProjectDetails({
  project,
}: ProjectDetailsProps) {
  return (
    <Box flexDirection="column">
      <Text bold>
        {project.name.toUpperCase()}
      </Text>

      <Text> </Text>

      <Text>
        {project.description}
      </Text>

      <Text> </Text>

      <Text bold>STACK</Text>

      <Text dimColor>
        {project.stack.join(" • ")}
      </Text>

      <Text> </Text>

      <Text bold>HIGHLIGHTS</Text>

      <Text> </Text>

      {project.highlights.map((highlight) => (
        <Text key={highlight}>
          • {highlight}
        </Text>
      ))}

      <Text> </Text>

      {project.links.github && (
        <Text>
          GitHub: {project.links.github}
        </Text>
      )}

      {project.links.demo && (
        <Text>
          Demo: {project.links.demo}
        </Text>
      )}
    </Box>
  );
}