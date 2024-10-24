import { Bench } from "tinybench";
import { wcswidth } from "../index.js";
import stringWidth from "string-width";

const bench = new Bench({ name: "simple benchmark", time: 100 });

const tests = [
  "",
  "Hello!",
  "!",
  "a~@!#~Z",
  "Hi\tthere",
  "There is an \x1b",
  "\x01",
  "\x00",
  "m\u00fcller",
  "cafe\u0301",
  "café",
  "\u0301",
  "コンニチハ, セカイ!",
  "Hi\u{1f44b}!",
  "\u{1f1f5}\u{1f1eb}",
  "This is the \u{1F1E9}\u{1F1EC} island",
  "\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}",
  // emoji VS15-16
  "\ufe0e",
  "\ufe0f",
  "\u26a0",
  "\u26a0\ufe0f",
  "\u26a0\ufe0e",
  "This is a \u26a0 warning!",
  "This is a \u26a0\ufe0e warning!",
  "This is a \u26a0\ufe0f warning!",
  "\u2666\ufe0e",
  "\u2666\ufe0f",
  "\u26f9\ufe0e",
  "\u26f9\ufe0f",
  "\u{1f429}",
  "\u{1f429}\ufe0f",
  "5\ufe0f\u20e3",
  "5\ufe0f\u20e3 + 1 = 6",
  // emoji modifier
  "\u{1f3fc} is a skin tone!",
  "\u{1F4EE}\u{1F3FE}",
  "\u{1F44D}\u{1F3FF}",
  "\u{1F600}\u{1F3FB}",
  "\u{26F9}\u{1F3FC}",
  "\u{26F9}\u{1F3FC}",
  "\u{26F9}\u{FE0F}\u{1F3FD}",
  "\u{26F9}\u{FE0E}\u{1F3FE}",
  "\u{26F9}\u{1F3FF}=\u{26F9}\u{FE0E}\u{1F3FF}",
  "\u{26FA}\u{1F3FB}",
  "\u{26F9}\u{1F44D}\u{1F3FC}",
  "\u{26F9}\u{1F44D}\u{1F3FC}",
  "\u{26F9}\u{1F44D}\u{1F3FC}",
  "\u{1F469}\u{200D}\u{1F9AF}",
  "\u{1F469}\u{200D}\u{1F9AF}\u{200D}\u{27A1}",
  "\u{1F469}\u{200D}\u{1F9AF}\u{200D}\u{27A1}\u{FE0F}",
  "\u{1F469}\u{200D}\u{2764}\u{200D}\u{1F468}",
  "\u{1F469}\u{200D}\u{2764}\u{FE0F}\u{200D}\u{1F468}",
  "\u{1F3C3}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}",
  "\u{1F3C3}\u{1F3FE}\u{200D}\u{2642}",
  "\u{1F9D1}\u{1F3FD}\u{200D}\u{2764}\u{200D}\u{1F48B}\u{200D}\u{1F9D1}\u{1F3FE}",
  "\u{1F9D1}\u{1F3FD}\u{200D}\u{2764}\u{FE0F}\u{200D}\u{1F48B}\u{200D}\u{1F9D1}\u{1F3FE}",
  "\u{1F468}\u{200D}\u{1F468}\u{200D}\u{1F467}\u{200D}\u{1F467}",
  "\u{1F3C3}\u{1F3FE}\u{200D}\u{2642}=\u{1F3FE}\u{1F3C3}\u{2642}",
  "\u{1F3C3}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}=\u{1F3C3}\u{FE0F}\u{1F3FE}\u{2642}",
  "\u{26F9}\u{1F3FC}\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}!",
  "\u{26F9}\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}!",
];

bench
  .add("display-width", () => {
    for (const test of tests) {
      wcswidth(test);
    }
  })
  .add("string-width", async () => {
    for (const test of tests) {
      stringWidth(test);
    }
  });

await bench.run();

console.table(bench.table());
