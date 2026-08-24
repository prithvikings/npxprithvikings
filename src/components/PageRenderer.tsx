import About from "../pages/About.js";
import Experience from "../pages/Experience.js";

export type Page =
  | "about"
  | "experience";

interface PageRendererProps {
  page: Page;
  selectedIndex: number;
  onNavigate: (page: string, index: number) => void;
}

export default function PageRenderer({
  page,
  selectedIndex,
  onNavigate,
}: PageRendererProps) {
  switch (page) {
    case "about":
      return (
        <About
          selectedIndex={selectedIndex}
          onNavigate={onNavigate}
        />
      );

    case "experience":
      return (
        <Experience
          selectedIndex={selectedIndex}
          onNavigate={onNavigate}
        />
      );

    default:
      return null;
  }
}
