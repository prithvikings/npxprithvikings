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
    company: "GOLGIX",
    role: "Full Stack Engineer Intern",
    period: "Jun 2026 – Present",
    location: "Remote",

    description:
      "Engineering production systems across AI-powered industrial analytics, developer tooling, backend services, and mobile applications.",

    stack: [
      "React",
      "Next.js",
      "Python",
      "TypeScript",
      "Node.js",
      "Docker",
      "GitHub Actions",
      "React Native",
    ],

    highlights: [
      "Shipped 68 PRs across 10+ production repositories in 3 months, covering features, CI/CD, infrastructure, and AI-powered industrial analytics.",
      "Built an SLA scheduler, helpdesk email service, stale PR manager, and streaming AI chat UI.",
      "Rolled out static analysis across 6 repositories and consolidated CI pipelines with GitHub Actions.",
      "Owned mobile app improvements including code ownership, unread notification badges, onboarding flows, and production-ready App Store and Play Store assets.",
      "Deployed data-sync services to production, provisioned Grafana alerts, and helped decommission legacy infrastructure.",
    ],
  },
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