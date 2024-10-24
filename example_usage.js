import { wcswidth } from "./index.js";

[
  "cafe\u0301",
  "\u26a0\ufe0e warning",
  "\u{1F468}\u{200D}\u{1F468}\u{200D}\u{1F467}\u{200D}\u{1F467}",
  "\u{1F469}\u{200D}\u{2764}\u{FE0F}\u{200D}\u{1F468}",
].forEach((demo) =>
  console.log(
    `>> wcswidth("${demo}") == ${wcswidth(demo)}\n>> "${demo}".length == ${demo.length}\n`,
  ),
);
