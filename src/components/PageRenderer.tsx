import About from "../pages/About.js";
import Contact from "../pages/Contact.js";
import Experience from "../pages/Experience.js";

export type Page =
  | "about"
  | "experience"
  | "contact";

interface PageRendererProps {
  page: Page;
  selectedIndex: number;
  selectedContactIndex: number;
  onNavigate: (page: string, index: number) => void;
}

export default function PageRenderer({
  page,
  selectedIndex,
  selectedContactIndex,
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

    case "contact":
      return (
        <Contact
          selectedContactIndex={selectedContactIndex}
        />
      );

    default:
      return null;
  }
}
