import { Text } from "ink";
import { useState } from "react";

import TerminalLayout from "./components/TerminalLayout.js";
import PageRenderer from "./components/PageRenderer.js";
import ProjectList from "./components/ProjectList.js";
import ProjectDetails from "./components/ProjectDetails.js";
import Home from "./pages/Home.js";

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
    <TerminalLayout footer="↑ ↓ Navigate • Enter Select • Q Quit">
      <Home
        selectedIndex={selectedIndex}
      />
    </TerminalLayout>
  );
}

    if (view === "project-list") {
      return (
        <TerminalLayout footer="↑ ↓ Navigate • Enter Select • ESC Back">
          <Text bold>PROJECTS</Text>

          <Text> </Text>

          <ProjectList
            selectedIndex={selectedProjectIndex}
          />
        </TerminalLayout>
      );
    }

    if (view === "project-details") {
      return (
        <TerminalLayout footer="ESC Back">
          <ProjectDetails
            project={projects[selectedProjectIndex]}
          />
        </TerminalLayout>
      );
    }

    if (
      view === "about" ||
      view === "experience" ||
      view === "contact"
    ) {
      return (
        <TerminalLayout footer="ESC Back • Q Quit">
          <PageRenderer page={view} />
        </TerminalLayout>
      );
    }

    return null;
  };

  return renderContent();
}