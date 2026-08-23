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

interface AppProps {
  initialView?: View;
}

export default function App({
  initialView = "home",
}: AppProps) {
  const [view, setView] =
    useState<View>(initialView);

  const [selectedIndex, setSelectedIndex] =
    useState(0);

  const [
    selectedProjectIndex,
    setSelectedProjectIndex,
  ] = useState(0);

  const [
    selectedContactIndex,
    setSelectedContactIndex,
  ] = useState(0);

  usePortfolioInput({
    view,
    selectedIndex,
    selectedProjectIndex,
    selectedContactIndex,
    setView,
    setSelectedIndex,
    setSelectedProjectIndex,
    setSelectedContactIndex,
  });

  const renderContent = () => {
    // -------------------------
    // HOME
    // -------------------------

    if (view === "home") {
      return (
        <TerminalLayout footer="↑ ↓ Navigate • Enter Select • Q Quit">
          <Home
            selectedIndex={selectedIndex}
          />
        </TerminalLayout>
      );
    }

    // -------------------------
    // PROJECT LIST
    // -------------------------

    if (view === "project-list") {
      return (
        <TerminalLayout footer="↑ ↓ Navigate • Enter Select • ESC Back">
          <Text bold>
            PROJECTS
          </Text>

          <Text> </Text>

          <ProjectList
            selectedIndex={selectedProjectIndex}
          />
        </TerminalLayout>
      );
    }

    // -------------------------
    // PROJECT DETAILS
    // -------------------------

    if (view === "project-details") {
      return (
        <TerminalLayout footer="ESC Back">
          <ProjectDetails
            project={
              projects[selectedProjectIndex]
            }
          />
        </TerminalLayout>
      );
    }

    // -------------------------
    // OTHER PAGES
    // -------------------------

    if (
      view === "about" ||
      view === "experience" ||
      view === "contact"
    ) {
      return (
        <TerminalLayout footer="ESC Back • Q Quit">
          <PageRenderer
            page={view}
            selectedContactIndex={
              selectedContactIndex
            }
          />
        </TerminalLayout>
      );
    }

    return null;
  };

  return renderContent();
}