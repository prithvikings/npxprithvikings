import { Text } from "ink";
import { useState } from "react";

import TerminalLayout from "./components/TerminalLayout.js";
import PageRenderer from "./components/PageRenderer.js";
import ProjectList from "./components/ProjectList.js";
import ProjectDetails from "./components/ProjectDetails.js";
import Home from "./pages/Home.js";
import Welcome from "./pages/Welcome.js";

import {
  usePortfolioInput,
  type View,
} from "./hooks/usePortfolioInput.js";

import { projects } from "./data/projects.js";

interface AppProps {
  initialView?: View;
}

export default function App({
  initialView = "welcome",
}: AppProps) {
  const resolvedInitialView =
    initialView === "home" && !process.argv[2]
      ? "welcome"
      : initialView;

  const [view, setView] = useState<View>(resolvedInitialView);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);
  const [selectedContactIndex, setSelectedContactIndex] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);

  // The home page is intentionally a virtual viewport. Keeping the scroll
  // state here ensures the root input handler owns arrow-key navigation and
  // avoids nested useInput handlers competing for the same key events.
  const homeScrollMax = 50;

  usePortfolioInput({
    view,
    selectedIndex,
    selectedProjectIndex,
    selectedContactIndex,
    scrollOffset,
    scrollMax: homeScrollMax,
    setView: (nextView) => {
      setScrollOffset(0);
      setView(nextView);
    },
    setSelectedIndex,
    setSelectedProjectIndex,
    setSelectedContactIndex,
    setScrollOffset,
  });

  const renderContent = () => {
    if (view === "welcome") {
      return <Welcome onContinue={() => setView("home")} />;
    }

    if (view === "home") {
      return (
        <TerminalLayout showHeader={false}>
          <Home
            selectedIndex={selectedIndex}
            scrollOffset={scrollOffset}
            scrollMax={homeScrollMax}
          />
        </TerminalLayout>
      );
    }

    if (view === "project-list") {
      return (
        <TerminalLayout footer="↑ ↓ Navigate • Enter Select • ESC Back">
          <Text bold>PROJECTS</Text>
          <Text> </Text>
          <ProjectList selectedIndex={selectedProjectIndex} />
        </TerminalLayout>
      );
    }

    if (view === "project-details") {
      return (
        <TerminalLayout footer="ESC Back">
          <ProjectDetails project={projects[selectedProjectIndex]} />
        </TerminalLayout>
      );
    }

    if (view === "about" || view === "experience" || view === "contact") {
      return (
        <TerminalLayout footer="ESC Back • Q Quit">
          <PageRenderer page={view} selectedContactIndex={selectedContactIndex} />
        </TerminalLayout>
      );
    }

    return null;
  };

  return renderContent();
}
