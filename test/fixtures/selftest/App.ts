import * as nodePath from "@tsonic/nodejs/path.js";

const runPathSmoke = (): string => {
  const joined = nodePath.join("alpha", "beta", "gamma.txt");
  const parsed = nodePath.parse(joined);
  if (
    parsed.base !== "gamma.txt" ||
    nodePath.basename(joined) !== "gamma.txt" ||
    nodePath.extname(joined) !== ".txt"
  ) {
    throw new Error("path smoke failed");
  }

  return "path-ok";
};

export async function main(): Promise<void> {
  const pathResult = runPathSmoke();
  console.log(pathResult);
}
