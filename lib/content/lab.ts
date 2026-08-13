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
    id: "procedural-105",
    index: "001",
    title: "Procedural 105",
    category: "WebGL",
    status: "live",
    description:
      "Hero object — digits with depth, copper orbit, and tiered fragment field.",
  },
  {
    id: "webgl-typography",
    index: "002",
    title: "WebGL Typography",
    category: "Creative coding",
    status: "wip",
    description: "Canvas-rendered serif digits with ceramic material response.",
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
    description: "Hold-to-disassemble object interaction for portfolio moments.",
  },
  {
    id: "scroll-bridge",
    index: "005",
    title: "Scroll Particle Bridge",
    category: "Motion",
    status: "live",
    description: "Dissolve particles that travel from hero into page sections.",
  },
];
