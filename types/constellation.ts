export type ConstellationTheme = "Memory" | "Journey" | "Promise" | "Dream" | "Discovery";

export type SharedConstellationDraft = {
  cityId: string;
  date: string;
  time: string;
  starIds: string[];
  closed: boolean;
  name: string;
  theme: ConstellationTheme;
  meaning: string;
};
