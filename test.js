import { before, after, describe, it } from "node:test";
import assert, { equal } from "node:assert";

import { wcwidth, wcswidth } from "./index.js";

describe("wcwidth", () => {
  const tests = {
    // basic
    exclamation: ["!", 1],
    a: ["a", 1],
    // non-printables
    one: ["\x01", -1],
    esc: ["\x1b", -1],
    carriage: ["\r", -1],
    linebreak: ["\n", -1],
    zero: ["\x00", 0],
    // accent
    acute: ["\u0301", 0],
    // narrow and wide
    rightTriangle: ["\u22bf", 1],
    turnedNotSign: ["\u2319", 1],
    watchHourglass: ["\u231a", 2],
    watchHourglass2: ["\u231b", 2],
    warningSign: ["\u26a0", 1],
    heavyPlus: ["\u2795", 2],
    ideographicHalfFill: ["\u303f", 1],
    hiraganaSmallA: ["\u3041", 2],
    segmentedDigitThree: ["\u{1fbf3}", 1],
    katakanaSmallHa: ["\u31f5", 2],
    cjkTiger: ["\u4e54", 2],
    // basic emoji
    smiley: ["\u{1f600}", 2],
    shakingFace: ["\u{1fae8}", 2],
    // emoji VS15-VS16
    vs16: ["\ufe0e", 0],
    vs162: ["\ufe0f", 0],
    warnEmoji: ["\u26a0", 1],
    tent: ["\u26fa", 2],
    diamondSuit: ["\u2666", 1],
    personBouncingBall: ["\u26f9", 1],
    // emoji modifiers
    emFitzpatrickType3: ["\u{1f3fc}", 2],
    emFitzpatrickType5: ["\u{1f3fe}", 2],
  };

  it("works as expected", () => {
    for (const key of Object.keys(tests)) {
      const [val, len] = tests[key];
      try {
        equal(
          wcwidth(val),
          len,
          `test ${key} failed: wcwidth(${val}) == ${wcwidth(val)} != ${len}`,
        );
      } catch (e) {
        equal(0, 1, `test ${key} threw <${e.message}> on wcwidth(${val})`);
        throw e;
      }
    }
  });

  it("throws when len != 1", () => {
    try {
      wcwidth("");
      equal(1, 0);
    } catch (e) {
      assert(e.message.match(/need a single/));
    }
    try {
      wcwidth("ab");
      equal(1, 0);
    } catch (e) {
      assert(e.message.match(/need a single/));
    }
  });
});

describe("wcswidth", () => {
  const tests = {
    // basic
    empty: ["", 0],
    hi: ["Hello!", 6],
    exclamation: ["!", 1],
    punctuation: ["a~@!#~Z", 7],
    // non-printables
    tab: ["Hi\tthere", -1], // wut why
    esc: ["There is an \x1b", -1], // why
    one: ["\x01", -1],
    zero: ["\x00", 0],
    // accents
    umlaut: ["m\u00fcller", 6],
    café1: ["cafe\u0301", 4],
    café2: ["café", 4],
    acute: ["\u0301", 0],
    // narrow and wide
    helloWorldJP: ["コンニチハ, セカイ!", 19],
    jpOffset: ["コンニチハ, セカイ!", 12, 7],
    // basic emoji
    hiWave: ["Hi\u{1f44b}!", 5],
    // flag sequence
    frenchPolynesia: ["\u{1f1f5}\u{1f1eb}", 2],
    diegoGarcia: ["This is the \u{1F1E9}\u{1F1EC} island", 21],
    scotland: [
      "\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}",
      2,
    ],
    // emoji VS15-16
    vs16: ["\ufe0e", 0],
    vs162: ["\ufe0f", 0],
    warn1: ["\u26a0", 1],
    warn2: ["\u26a0\ufe0f", 2],
    warn3: ["\u26a0\ufe0e", 1],
    warn4: ["This is a \u26a0 warning!", 20],
    warn5: ["This is a \u26a0\ufe0e warning!", 20],
    warn6: ["This is a \u26a0\ufe0f warning!", 21],
    diamondSuit: ["\u2666\ufe0e", 1],
    diamondSuit2: ["\u2666\ufe0f", 2],
    personBouncingBall: ["\u26f9\ufe0e", 1],
    personBouncingBall2: ["\u26f9\ufe0f", 2],
    noOpOnPoodle: ["\u{1f429}", 2],
    noOpOnPoodle2: ["\u{1f429}\ufe0f", 2],
    keyCap1: ["5\ufe0f\u20e3", 2],
    keyCap2: ["5\ufe0f\u20e3 + 1 = 6", 10],
    // emoji modifier
    emFitzpatrickType3: ["\u{1f3fc} is a skin tone!", 18],
    doesNotModifyPostbox: ["\u{1F4EE}\u{1F3FE}", 4],
    modifiesThumbUp: ["\u{1F44D}\u{1F3FF}", 2],
    doesNotModifySmiley: ["\u{1F600}\u{1F3FB}", 4],
    modifiesAndEmojifiesPersonBouncingBall: ["\u{26F9}\u{1F3FC}", 2],
    modifiesAndEmojifiesPersonBouncingBall2: ["\u{26F9}\u{1F3FC}", 1, 1],
    doesNotModifyPersonBouncingBallVS16: ["\u{26F9}\u{FE0F}\u{1F3FD}", 4],
    doesNotModifyPersonBouncingBallVS15: ["\u{26F9}\u{FE0E}\u{1F3FE}", 3],
    doesNotModifyPersonBouncingBallExplained: [
      "\u{26F9}\u{1F3FF}=\u{26F9}\u{FE0E}\u{1F3FF}",
      6,
    ],
    doesNotModifyTent: ["\u{26FA}\u{1F3FB}", 4],
    doesNotAlsoModifyOlderChars1: ["\u{26F9}\u{1F44D}\u{1F3FC}", 3],
    doesNotAlsoModifyOlderChars2: ["\u{26F9}\u{1F44D}\u{1F3FC}", 1, 1],
    doesNotAlsoModifyOlderChars3: ["\u{26F9}\u{1F44D}\u{1F3FC}", 3, 2],
    womanWithWhiteCane: ["\u{1F469}\u{200D}\u{1F9AF}", 2],
    womanWithWhiteCaneFacingRight: [
      "\u{1F469}\u{200D}\u{1F9AF}\u{200D}\u{27A1}",
      2,
    ],
    womanWithWhiteCaneFacingRigthFullyQualified: [
      "\u{1F469}\u{200D}\u{1F9AF}\u{200D}\u{27A1}\u{FE0F}",
      2,
    ],
    coupleWithHeartWomanMan: ["\u{1F469}\u{200D}\u{2764}\u{200D}\u{1F468}", 2],
    coupleWithHeartWomanMan2: [
      "\u{1F469}\u{200D}\u{2764}\u{FE0F}\u{200D}\u{1F468}",
      2,
    ],
    manRunningMediuDarkSkinTone: [
      "\u{1F3C3}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}",
      2,
    ],
    manRunningMediuDarkSkinTone2: ["\u{1F3C3}\u{1F3FE}\u{200D}\u{2642}", 2],
    kissPersonPersonMediumSkinToneMediumDarkSkinTone: [
      "\u{1F9D1}\u{1F3FD}\u{200D}\u{2764}\u{200D}\u{1F48B}\u{200D}\u{1F9D1}\u{1F3FE}",
      2,
    ],
    kissPersonPersonMediumSkinToneMediumDarkSkinTone2: [
      "\u{1F9D1}\u{1F3FD}\u{200D}\u{2764}\u{FE0F}\u{200D}\u{1F48B}\u{200D}\u{1F9D1}\u{1F3FE}",
      2,
    ],
    familyManManGirlGirl: [
      "\u{1F468}\u{200D}\u{1F468}\u{200D}\u{1F467}\u{200D}\u{1F467}",
      2,
    ],
    manRunningExplained: [
      "\u{1F3C3}\u{1F3FE}\u{200D}\u{2642}=\u{1F3FE}\u{1F3C3}\u{2642}",
      8,
    ],
    manRunningExplained2: [
      "\u{1F3C3}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}=\u{1F3C3}\u{FE0F}\u{1F3FE}\u{2642}",
      8,
    ],
    personPlayingBallForScotland: [
      "\u{26F9}\u{1F3FC}\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}!",
      5,
    ],
    personPlayingBallForScotland2: [
      "\u{26F9}\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}!",
      4,
    ],
  };

  it("works as expected", () => {
    for (const key of Object.keys(tests)) {
      const [val, len, offset] = tests[key];
      console.log(val);
      equal(
        wcswidth(val, offset),
        len,
        `test ${key} failed: wcswidth(${val}) == ${wcswidth(val)} != ${len}`,
      );
    }
  });
});
