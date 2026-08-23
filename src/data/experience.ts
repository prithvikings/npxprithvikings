export interface Experience {
  company: string;
  role: string;
  period: string;
  location?: string;
  description: string;
  stack: string[];
  highlights: string[];
}

export const experience: Experience[] = [
  {
    company: "FloriWish",
    role: "Full Stack Developer",
    period: "Jun 2025 – Mar 2026",
    location: "India",

    description:
      "Worked on a scalable e-commerce platform, focusing on backend performance, caching, database optimization, and frontend performance.",

    stack: [
      "Next.js",
      "Node.js",
      "MongoDB",
      "Redis",
      "AWS",
    ],

    highlights: [
      "Reduced product-page latency from ~18–20s to sub-500ms.",
      "Implemented Redis caching and parallel API pipelines.",
      "Built dynamic inventory and pricing logic.",
      "Improved frontend performance and Largest Contentful Paint.",
    ],
  },
];