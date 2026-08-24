import { useState } from "react";

import TerminalLayout from "./components/TerminalLayout.js";
import PageRenderer from "./components/PageRenderer.js";
import ProjectList from "./components/ProjectList.js";
import ProjectDetails from "./components/ProjectDetails.js";
import Home from "./pages/Home.js";
import Projects from "./pages/Projects.js";
import Welcome from "./pages/Welcome.js";

import {
  usePortfolioInput,
  type View,
} from "./hooks/usePortfolioInput.js";

import { projects } from "./data/projects.js";
import { navigationItems } from "./data/navigation.js";

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

  usePortfolioInput({
    view,
    selectedIndex,
    selectedProjectIndex,
    setView,
    setSelectedIndex,
    setSelectedProjectIndex,
  });

  const handleNavigation = (page: string, index: number) => {
    setSelectedIndex(index);

    if (navigationItems.some((item) => item.page === page)) {
      setView(page as View);
    }
  };

  const renderContent = () => {
    if (view === "welcome") {
      return <Welcome onContinue={() => setView("home")} />;
    }

    if (view === "home") {
      return (
        <TerminalLayout showHeader={false}>
          <Home selectedIndex={selectedIndex} onNavigate={handleNavigation} />
        </TerminalLayout>
      );
    }

    if (view === "projects") {
      return (
        <Projects
          selectedIndex={selectedIndex}
          onNavigate={handleNavigation}
        />
      );
    }

    if (view === "project-list") {
      return (
        <TerminalLayout footer="↑ ↓ Navigate • Enter Select • ESC Back">
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

    if (view === "about" || view === "experience") {
      return (
        <PageRenderer
          page={view}
          selectedIndex={selectedIndex}
          onNavigate={handleNavigation}
        />
      );
    }

    return null;
  };

  return renderContent();
}
