import { Assert } from "xunit-types/Xunit.js";

export const utf8Bytes = (str: string): Uint8Array =>
  new TextEncoder().encode(str);

export const assertThrows = (action: () => void): void => {
  let threw = false;
  try {
    action();
  } catch {
    threw = true;
  }

  Assert.True(threw);
};
