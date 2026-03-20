import { readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const repoRoot = resolve(new URL("..", import.meta.url).pathname);
const clrTestsRoot = join(repoRoot, "..", "nodejs-clr", "tests", "nodejs.Tests");

const implementedModules = new Set(["path"]);

const moduleDirs = readdirSync(clrTestsRoot)
  .map((name) => join(clrTestsRoot, name))
  .filter((path) => statSync(path).isDirectory())
  .map((path) => ({
    name: path.slice(path.lastIndexOf("/") + 1),
    path,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

let implementedCount = 0;
let pendingCount = 0;

for (const moduleDir of moduleDirs) {
  const fileCount = readdirSync(moduleDir.path).filter((name) =>
    name.endsWith(".cs")
  ).length;
  const implemented = implementedModules.has(moduleDir.name);
  if (implemented) {
    implementedCount += 1;
  } else {
    pendingCount += 1;
  }

  const status = implemented ? "native-slice" : "pending";
  console.log(
    `${moduleDir.name.padEnd(18)} ${status.padEnd(12)} ${String(fileCount).padStart(3)} test file(s)`
  );
}

console.log("");
console.log(`implemented modules: ${implementedCount}`);
console.log(`pending modules:     ${pendingCount}`);
