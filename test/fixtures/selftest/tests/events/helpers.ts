import { Assert } from "xunit-types/Xunit.js";

export const assertThrows = (action: () => unknown): void => {
  let threw = false;
  try {
    action();
  } catch {
    threw = true;
  }

  Assert.True(threw);
};
