import { BrickWallShield, GitMerge, Save, SquareChartGantt } from "lucide-react";

export const superAdminLinks = [
  {
    title: "Overview",
    url: "/overview",
    icon: SquareChartGantt,
  },
  {
    title: "Approval Queue",
    url: "/approval-queue",
    icon: BrickWallShield,
  },
  {
    title: "Workflows",
    url: "/workflow",
    icon: GitMerge,
  },
  {
    title: "Templates",
    url: "/templates",
    icon: Save,
  },
];
