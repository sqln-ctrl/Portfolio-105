export type LabExperiment = {
  id: string;
  index: string;
  title: string;
  category: string;
  status: "live" | "wip" | "concept";
  description: string;
};

export const labExperiments: LabExperiment[] = [
  {
    id: "open-loop",
    index: "001",
    title: "Open Loop",
    category: "WebGL",
    status: "live",
    description:
      "A glass infinity mark that separates into floating pieces as you scroll the homepage.",
  },
  {
    id: "webgl-typography",
    index: "002",
    title: "WebGL Typography",
    category: "Creative coding",
    status: "wip",
    description: "Exploring expressive type and material response in three dimensions.",
  },
  {
    id: "ai-agent-runner",
    index: "003",
    title: "AI Agent Experiment",
    category: "AI",
    status: "wip",
    description: "Task-runner UI for tool-using agents — progress over chat.",
  },
  {
    id: "interactive-3d",
    index: "004",
    title: "Interactive 3D Scene",
    category: "3D",
    status: "concept",
    description: "Exploring pointer-led interaction with procedural objects.",
  },
  {
    id: "scroll-bridge",
    index: "005",
    title: "Crystal Field",
    category: "Motion",
    status: "live",
    description: "Transparent crystals and a subtle particle field surrounding the homepage loop.",
  },
];
