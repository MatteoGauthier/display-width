import { table, wtable, embtable, embtableLen } from "./tables.js";

/**
 * return the width of a single codepoint
 *
 * @param {string} uwc
 * @return {number}
 */
export function wcwidth(uwc) {
  if (Array.from(uwc).length !== 1) {
    throw new Error(`need a single codepoint, got ${uwc}`);
  }
  return _wcwidth(uwc.codePointAt(0));
}

/** return the width of a string
 *
 * @param {string} ustr
 * @param {number} n the length of the string to stop at, specified in code
 *                   points
 * @return {number}
 */
export function wcswidth(ustr, n) {
  // Instead, use a for...of statement or spread the string, both of which
  // invoke the string's [Symbol.iterator](), which iterates by code points.
  // Then, use codePointAt(0) to get the code point of each element.
  //
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt
  //
  // [Symbol.iterator]() iterates by Unicode code points
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
  //
  // convert the string into an array of codepoints, and get the numeric value
  // of each
  /** @type{number[]} */
  let codepoints = Array.from(ustr).map((c) => c.codePointAt(0));
  let i = 0;
  let s = 0;
  let w = 0;
  let l = n === undefined ? codepoints.length : n;
  let wc_last = 0;

  while (i < l) {
    const wc = codepoints[i];
    if (wc === 0x200d) {
      // skip over ZWJ segment
      i = i + 2;
      wc_last = wc;
      if (i < l) {
        if (
          (codepoints[i] >= 0x1f3fb && codepoints[i] <= 0x1f3ff) ||
          codepoints[i] === 0xfe0f
        ) {
          i++;
        }
      }
      continue;
    }
    if (wc === 0xfe0f) {
      // VS-16 hack: force width to 2
      wc_last = wc;
      s += w === 1 ? 1 : 0;
      w = 2;
      i++;
      continue;
    }
    w = isEmojiModifier(wc_last, wc) ? 2 - w : _wcwidth(wc); // Emoji Modifier promotes width to 2
    if (w === -1) {
      return -1;
    }
    s += w;
    i += 1;
    wc_last = wc;
  }

  return s;
}

function isEMB(uwc) {
  if (Array.from(uwc).length !== 1) {
    throw new Error(`need a single codepoint, got ${uwc}`);
  }
  return isEmojiModifier(uwc.codePointAt(0), 0x1f3fb);
}

function isEMBUint32(wc) {
  return isEmojiModifier(wc, 0x1f3fb);
}

// Identify emoji modifier base per UTS #51 using the embtable bitmap
function isEmojiModifier(wcLast, wc) {
  if (wc < 0x1f3fb || wc > 0x1f3ff) {
    return 0;
  }
  if (wcLast < 0x1f385) {
    return (
      wcLast === 0x261d ||
      wcLast === 0x26f9 ||
      (wcLast >= 0x270a && wcLast <= 0x270d)
    );
  }
  const off = wcLast - 0x1f385;
  const byte = off >> 3;
  const bit = off & 7;
  if (byte >= embtableLen) {
    return 0;
  }
  return embtable[byte] & (1 << bit);
}

/**
 * return the width of a single codepoint
 *
 * derived from musl: https://github.com/kraj/musl/blob/ffb23aef/src/ctype/wcwidth.c#L11-L29
 *
 * @param {number} uwc
 * @return {number}
 */
function _wcwidth(wc) {
  if (wc < 0xff) {
    return ((wc + 1) & 0x7f) >= 0x21 ? 1 : wc ? -1 : 0;
  }

  if ((wc & 0xfffeffff) < 0xfffe) {
    if ((table[table[wc >> 8] * 32 + ((wc & 255) >> 3)] >> (wc & 7)) & 1)
      return 0;
    if ((wtable[wtable[wc >> 8] * 32 + ((wc & 255) >> 3)] >> (wc & 7)) & 1)
      return 2;
    return 1;
  }

  if ((wc & 0xfffe) === 0xfffe) {
    return -1;
  }

  if (wc - 0x20000 < 0x20000) {
    return 2;
  }

  if (wc === 0xe0001 || wc - 0xe0020 <= 0x5f || wc - 0xe0100 < 0xef) {
    return 0;
  }

  return 1;
}
