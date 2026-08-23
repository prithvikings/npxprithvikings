import { Box, Text } from "ink";
import { useState } from "react";

import Header from "./components/Header.js";
import Navigation from "./components/Navigation.js";
import PageRenderer from "./components/PageRenderer.js";
import ProjectList from "./components/ProjectList.js";
import ProjectDetails from "./components/ProjectDetails.js";

import {
  usePortfolioInput,
  type View,
} from "./hooks/usePortfolioInput.js";

import { projects } from "./data/projects.js";

export default function App() {
  const [view, setView] =
    useState<View>("home");

  const [selectedIndex, setSelectedIndex] =
    useState(0);

  const [
    selectedProjectIndex,
    setSelectedProjectIndex,
  ] = useState(0);

  usePortfolioInput({
    view,
    selectedIndex,
    selectedProjectIndex,
    setView,
    setSelectedIndex,
    setSelectedProjectIndex,
  });

  const renderContent = () => {
    if (view === "home") {
      return (
        <>
          <Navigation
            selectedIndex={selectedIndex}
          />

          <Text> </Text>

          <Text dimColor>
            ↑ ↓ Navigate • Enter Select • Q Quit
          </Text>
        </>
      );
    }

    if (view === "project-list") {
      return (
        <>
          <Text bold>PROJECTS</Text>

          <Text> </Text>

          <ProjectList
            selectedIndex={selectedProjectIndex}
          />

          <Text> </Text>

          <Text dimColor>
            ↑ ↓ Navigate • Enter Select • ESC Back
          </Text>
        </>
      );
    }

    if (view === "project-details") {
      return (
        <>
          <ProjectDetails
            project={
              projects[selectedProjectIndex]
            }
          />

          <Text> </Text>

          <Text dimColor>
            ESC Back
          </Text>
        </>
      );
    }

    return (
      <>
        <PageRenderer
          page={view}
        />

        <Text> </Text>

        <Text dimColor>
          ESC Back • Q Quit
        </Text>
      </>
    );
  };

  return (
    <Box
      flexDirection="column"
      padding={1}
    >
      <Header />

      <Text> </Text>

      {renderContent()}
    </Box>
  );
}
