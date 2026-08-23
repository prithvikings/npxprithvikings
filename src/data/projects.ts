export interface Project {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  stack: string[];
  highlights: string[];
  links: {
    github?: string;
    demo?: string;
  };
  featured?: boolean;
}

export const projects: Project[] = [
  {
    id: "sketchr",
    name: "Sketchr",

    shortDescription:
      "Real-time collaborative whiteboarding platform.",

    description:
      "A collaborative whiteboarding platform combining real-time collaboration, communication, and AI-powered diagram generation.",

    stack: [
      "React",
      "Node.js",
      "MongoDB",
      "Socket.io",
      "WebRTC",
      "Gemini",
      "Zustand",
      "Zod",
    ],

    highlights: [
      "Real-time collaborative canvas.",
      "P2P video calls and screen sharing.",
      "AI-powered flowchart generation.",
      "Debounced MongoDB persistence.",
    ],

    links: {
      github: "https://github.com/prithvikings/sketchr",
    },

    featured: true,
  },

  {
    id: "simplay",
    name: "Simplay",

    shortDescription:
      "AI-powered interactive video learning platform.",

    description:
      "A learning platform that uses AI to transform video content into interactive learning experiences.",

    stack: [
      "React",
      "Node.js",
      "MongoDB",
      "Gemini",
      "YouTube Transcript API",
      "Google OAuth",
    ],

    highlights: [
      "AI-generated summaries and insights.",
      "YouTube transcript processing.",
      "Authenticated learning progress.",
      "Server-side AI processing pipeline.",
    ],

    links: {
      github: "https://github.com/prithvikings/simplay",
    },

    featured: true,
  },

  {
    id: "devpostgen",
    name: "DevPostGen",

    shortDescription:
      "AI-powered developer content automation.",

    description:
      "A developer-focused platform that turns GitHub activity into structured, shareable content using AI.",

    stack: [
      "React",
      "Node.js",
      "MongoDB",
      "Gemini",
      "GitHub API",
      "Chrome Extension",
    ],

    highlights: [
      "GitHub OAuth integration.",
      "Transforms GitHub activity into content.",
      "LLM-generated structured posts.",
      "Browser extension integration.",
    ],

    links: {
      github: "https://github.com/prithvikings/devpostgen",
    },

    featured: true,
  },

  {
    id: "farmatlas",
    name: "FarmAtlas",

    shortDescription:
      "Livestock and farm management platform.",

    description:
      "A farm management application for tracking livestock, health records, feeding, inventory, and farm operations.",

    stack: [
      "React",
      "Node.js",
      "MongoDB",
      "Express",
      "Tailwind CSS",
    ],

    highlights: [
      "Animal lifecycle tracking.",
      "Health and feeding records.",
      "Inventory management.",
      "Role-based farm operations.",
    ],

    links: {
      github: "https://github.com/prithvikings/farmatlas",
    },

    featured: true,
  },

  {
    id: "greetcode",
    name: "GreetCode",

    shortDescription:
      "Browser-based competitive programming platform.",

    description:
      "A coding practice platform with an in-browser IDE and real-time code execution.",

    stack: [
      "React",
      "Node.js",
      "MongoDB",
      "Redis",
      "Judge0",
      "JWT",
    ],

    highlights: [
      "In-browser coding environment.",
      "Real-time code execution.",
      "Scalable backend APIs.",
      "Redis caching and API rate limiting.",
    ],

    links: {
      github: "https://github.com/prithvikings/greetcode",
    },

    featured: true,
  },
];