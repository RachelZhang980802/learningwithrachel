export type MuckRakeWord = "muck" | "rake";

export const muckRakeDefinitions: Record<
  MuckRakeWord,
  { word: string; english: string; chinese: string; tone: "yellow" | "blue" }
> = {
  muck: {
    word: "muck",
    english: "dirt · filth · waste",
    chinese: "污物、淤泥、肮脏的东西",
    tone: "yellow",
  },
  rake: {
    word: "rake",
    english: "a tool used to gather or clear material",
    chinese: "耙子；用耙子聚拢或清理东西",
    tone: "blue",
  },
};
