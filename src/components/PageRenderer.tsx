import About from "../pages/About.js";
import Contact from "../pages/Contact.js";
import Experience from "../pages/Experience.js";

export type Page =
  | "about"
  | "experience"
  | "contact";

interface PageRendererProps {
  page: Page;
}

export default function PageRenderer({
  page,
}: PageRendererProps) {
  switch (page) {
    case "about":
      return <About />;

    case "experience":
      return <Experience />;

    case "contact":
      return <Contact />;

    default:
      return null;
  }
}