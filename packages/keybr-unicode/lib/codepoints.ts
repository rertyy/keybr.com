import { type CodePoint } from "./types.ts";

export const isCodePoint = (value: number): boolean =>
  Number.isSafeInteger(value) && value >= 0 && value < 0x11_0000;

export const isBmpCodePoint = (codePoint: CodePoint): boolean =>
  codePoint < 0x01_0000;

export const isSupplementaryCodePoint = (codePoint: CodePoint): boolean =>
  codePoint >= 0x01_0000;

export const charCount = (codePoint: CodePoint): number =>
  codePoint >= 0x01_0000 ? 2 : 1;

export const toCodePoints = (text: string): Iterable<CodePoint> => {
  const { length } = text;
  return {
    [Symbol.iterator](): Iterator<CodePoint> {
      let index = 0;
      const result = { done: true, value: -1 } as IteratorResult<CodePoint>;
      return {
        next(): IteratorResult<CodePoint> {
          if (index < length) {
            const codePoint = text.codePointAt(index) ?? 0;
            index += charCount(codePoint);
            result.done = false;
            result.value = codePoint;
          } else {
            result.done = true;
            result.value = -1;
          }
          return result;
        },
      };
    },
  };
};

export const codePointLength = (text: string): number => {
  const it = toCodePoints(text)[Symbol.iterator]();
  let length = 0;
  while (true) {
    const { done } = it.next();
    if (done) {
      return length;
    }
    length += 1;
  }
};