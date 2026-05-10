export const PROBLEMATIC_CHARACTERS = [
  { char: "\u2022", name: "bullet point", replacement: "-" },
  { char: "\u2013", name: "en dash", replacement: "-" },
  { char: "\u2014", name: "em dash", replacement: "-" },
  { char: "\u201c", name: "curly quote left", replacement: '"' },
  { char: "\u201d", name: "curly quote right", replacement: '"' },
  { char: "\u2018", name: "curly apostrophe left", replacement: "'" },
  { char: "\u2019", name: "curly apostrophe right", replacement: "'" },
  { char: "\u2026", name: "ellipsis", replacement: "..." },
  { char: "\u00a9", name: "copyright", replacement: "(c)" },
  { char: "\u00ae", name: "registered", replacement: "(R)" },
  { char: "\u2122", name: "trademark", replacement: "(TM)" },
];
