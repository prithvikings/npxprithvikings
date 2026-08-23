import { useInput } from "ink";

import { navigationItems } from "../data/navigation.js";
import { projects } from "../data/projects.js";

export type View =
  | "home"
  | "about"
  | "experience"
  | "projects"
  | "contact"
  | "project-list"
  | "project-details";

interface UsePortfolioInputProps {
  view: View;
  selectedIndex: number;
  selectedProjectIndex: number;

  setView: (view: View) => void;
  setSelectedIndex: (
    updater: (current: number) => number
  ) => void;
  setSelectedProjectIndex: (
    updater: (current: number) => number
  ) => void;
}

export function usePortfolioInput({
  view,
  selectedIndex,
  selectedProjectIndex,
  setView,
  setSelectedIndex,
  setSelectedProjectIndex,
}: UsePortfolioInputProps) {
  useInput((input, key) => {
    // Quit from anywhere
    if (input === "q") {
      process.exit(0);
    }

    // -------------------------
    // HOME
    // -------------------------

    if (view === "home") {
      if (key.upArrow) {
        setSelectedIndex((current) =>
          current === 0
            ? navigationItems.length - 1
            : current - 1
        );
      }

      if (key.downArrow) {
        setSelectedIndex((current) =>
          current === navigationItems.length - 1
            ? 0
            : current + 1
        );
      }

      if (key.return) {
        const page =
          navigationItems[selectedIndex].page;

        if (page === "projects") {
          setSelectedProjectIndex(() => 0);
          setView("project-list");
        } else {
          setView(page);
        }
      }

      return;
    }

    // -------------------------
    // PROJECT LIST
    // -------------------------

    if (view === "project-list") {
      if (key.escape) {
        setView("home");
        return;
      }

      if (key.upArrow) {
        setSelectedProjectIndex((current) =>
          current === 0
            ? projects.length - 1
            : current - 1
        );
      }

      if (key.downArrow) {
        setSelectedProjectIndex((current) =>
          current === projects.length - 1
            ? 0
            : current + 1
        );
      }

      if (key.return) {
        setView("project-details");
      }

      return;
    }

    // -------------------------
    // PROJECT DETAILS
    // -------------------------

    if (view === "project-details") {
      if (key.escape) {
        setView("project-list");
      }

      return;
    }

    // -------------------------
    // OTHER PAGES
    // -------------------------

    if (key.escape) {
      setView("home");
    }
  });
}