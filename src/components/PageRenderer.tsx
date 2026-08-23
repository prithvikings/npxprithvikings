import { Box, Text } from "ink";

import About from "../pages/About.js";
import Experience from "../pages/Experience.js";
import Contact from "../pages/Contact.js";

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
      return (
        <Box>
          <Text>Page not found.</Text>
        </Box>
      );
  }
}