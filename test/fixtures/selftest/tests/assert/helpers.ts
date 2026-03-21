import { Assert } from "xunit-types/Xunit.js";

export const assertThrows = (action: () => void): unknown => {
  try {
    action();
  } catch (error) {
    return error;
  }

  Assert.True(false);
  return undefined;
};

export const assertThrowsAsync = async (
  action: () => Promise<unknown>,
): Promise<unknown> => {
  try {
    await action();
  } catch (error) {
    return error;
  }

  Assert.True(false);
  return undefined;
};
