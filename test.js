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
    // CJK ideographs are 20000-3ffff
    qiang: ["\u{2b017}", 2],
    // TIP, seal script
    seal_32477: ["\u{32477}", 2],
    // unassigned codepoints should default to 1,
    // likely for forward compatibility
    unassigned_plane_4: ["\u{40000}", 1],
    unassigned_plane_d: ["\u{d0000}", 1],
    unassigned_plane_e: ["\u{e0002}", 1],
    // musl code insists on doing this even in the tags plane for unassigned:
    // (should we just default to everything in 0xe0000-0xeffff as invisible?)
    tag_unassigned: ["\u{e0080}", 1],
    // but assigned codepoints in the tags code block should be invisible
    tag_begin: ["\u{e0001}", 0],
    tag_space: ["\u{e0020}", 0],
    tag_end: ["\u{e007f}", 0]
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
    //
    // > The wcswidth() function shall return -1 if any of the first n
    // wide-character codes in the wide-character string is not a printable
    // wide-character code.
    //
    // https://pubs.opengroup.org/onlinepubs/9699919799.2016edition/functions/wcswidth.html
    tab: ["Hi\tthere", -1],
    esc: ["There is an \x1b", -1],
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
    // from string-width
    // sindorhesus has this as two, but I believe one is more correct. How to be sure?
    heavyCircleWithStrokeAndTwoDots: ["\u25e3", 1],
    simple: ["abcde", 5],
    cjk1: ["古池や", 6],
    cjk2: ["あいうabc", 9],
    cjk3: ["あいう★", 7],
    plusminus: ["±", 1],
    katakana: ["ノード.js", 9],
    chinese: ["你好", 4],
    korean: ["안녕하세요", 10],
    surrogate: ["A\uD83C\uDE00BC", 5],
    escapes: ["\u001B[31m\u001B[39m", -1],
    emojiPresentationCharacter: ["\u{231A}", 2],
    emojiEitherWay: ["\u{2194}\u{FE0F}", 2],
    emojiModifierBase: ["\u{1F469}", 2],
    emojiModifierBaseAndModifier: ["\u{1F469}\u{1F3FF}", 2],
    variationSelectors: ["\u{845B}\u{E0100}", 2],
    thai: ["ปฏัก", 3],
    thaiCombiningChar: ["_\u0E34", 1],
    // sindorhesus has this as two for no reason I can tell?
    fancyQuote: ["“", 1],
    // Mitchell seems to say that this character (🧑‍🌾) shows a place
    // where wcswidth isn't correct and gives 4 instead of 2; however we return
    // 2. I don't quite understand what's going on here
    //
    // I even wrote a C program to use my systems' wcswidth and it returned 2
    //
    // https://mitchellh.com/writing/grapheme-clusters-in-terminals
    farmer: ["\u{1f9d1}\u200d\u{1f33e}", 2],
  };

  it("works as expected", () => {
    for (const key of Object.keys(tests)) {
      const [val, len, offset] = tests[key];
      equal(
        wcswidth(val, offset),
        len,
        `test ${key} failed: wcswidth(${val}) == ${wcswidth(val)} != ${len}`,
      );
    }
  });
});
