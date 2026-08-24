import { useInput } from "ink";

import { navigationItems } from "../data/navigation.js";
import { projects } from "../data/projects.js";
import { contactLinks } from "../data/contactLinks.js";
import { openUrl } from "../utils/openUrl.js";

export type View =
  | "welcome"
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
  selectedContactIndex: number;
  setView: (view: View) => void;
  setSelectedIndex: (updater: (current: number) => number) => void;
  setSelectedProjectIndex: (updater: (current: number) => number) => void;
  setSelectedContactIndex: (updater: (current: number) => number) => void;
}

const mainNavigationViews = new Set<View>([
  "home",
  "about",
  "experience",
  "projects",
  "contact",
]);

export function usePortfolioInput({
  view,
  selectedIndex,
  selectedProjectIndex,
  selectedContactIndex,
  setView,
  setSelectedIndex,
  setSelectedProjectIndex,
  setSelectedContactIndex,
}: UsePortfolioInputProps) {
  useInput((input, key) => {
    if (input === "q") process.exit(0);

    if (view === "welcome") {
      if (key.return) setView("home");
      return;
    }

    // Left/right always moves through the top-level pages with wraparound.
    // This is intentionally separate from project/contact item navigation,
    // which keeps their own up/down controls.
    if (mainNavigationViews.has(view) && (key.leftArrow || key.rightArrow)) {
      setSelectedIndex((current) => {
        const nextIndex = key.rightArrow
          ? current === navigationItems.length - 1
            ? 0
            : current + 1
          : current === 0
            ? navigationItems.length - 1
            : current - 1;

        setView(navigationItems[nextIndex].page as View);
        return nextIndex;
      });
      return;
    }

    if (view === "home") {
      // Section headers own plain Enter. Ctrl+Enter activates the selected
      // top navigation item without conflicting with section folding.
      if (key.return && key.ctrl) {
        const page = navigationItems[selectedIndex].page;
        if (page === "projects") {
          setSelectedProjectIndex(() => 0);
          setView("project-list");
        } else {
          setView(page as View);
        }
      }
      return;
    }

    if (view === "project-list") {
      if (key.escape) {
        setView("home");
        return;
      }
      if (key.upArrow) {
        setSelectedProjectIndex((current) =>
          current === 0 ? projects.length - 1 : current - 1,
        );
      }
      if (key.downArrow) {
        setSelectedProjectIndex((current) =>
          current === projects.length - 1 ? 0 : current + 1,
        );
      }
      if (key.return) setView("project-details");
      return;
    }

    if (view === "project-details") {
      if (key.escape) setView("project-list");
      return;
    }

    if (view === "contact") {
      if (key.escape) {
        setView("home");
        return;
      }
      if (key.upArrow) {
        setSelectedContactIndex((current) =>
          current === 0 ? contactLinks.length - 1 : current - 1,
        );
      }
      if (key.downArrow) {
        setSelectedContactIndex((current) =>
          current === contactLinks.length - 1 ? 0 : current + 1,
        );
      }
      if (key.return) openUrl(contactLinks[selectedContactIndex].url);
      return;
    }

    if (key.escape) setView("home");
  });
}
