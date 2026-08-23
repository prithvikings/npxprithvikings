export interface SkillGroup {
  title: string;
  skills: string[];
}

export const skills: SkillGroup[] = [
  {
    title: "Frontend",
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "GSAP",
      "Motion",
      "React Router",
    ],
  },

  {
    title: "Backend",
    skills: [
      "Node.js",
      "Express.js",
      "Laravel",
      "BullMQ",
      "Prisma",
    ],
  },

  {
    title: "Databases",
    skills: [
      "MongoDB",
      "PostgreSQL",
      "Redis",
    ],
  },

  {
    title: "AI",
    skills: [
      "Gemini",
      "LangChain",
    ],
  },

  {
    title: "Tools & Infrastructure",
    skills: [
      "Git",
      "Docker",
      "AWS",
      "Vercel",
      "Render",
    ],
  },

  {
    title: "Languages",
    skills: [
      "C++",
      "TypeScript",
      "JavaScript",
      "Python",
      "PHP",
    ],
  },
];
