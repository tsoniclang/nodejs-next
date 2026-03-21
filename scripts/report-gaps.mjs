import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const repoRoot = resolve(new URL("..", import.meta.url).pathname);
const clrTestsRoot = join(repoRoot, "..", "nodejs-clr", "tests", "nodejs.Tests");

const selftestRoot = join(repoRoot, "test", "fixtures", "selftest", "tests");

const implementedModules = new Set(
  readdirSync(selftestRoot)
    .map((name) => join(selftestRoot, name))
    .filter((entryPath) => statSync(entryPath).isDirectory())
    .map((entryPath) => entryPath.slice(entryPath.lastIndexOf("/") + 1))
);

const normalizeClrTestStem = (name) =>
  name
    .replace(/\.cs$/, "")
    .replace(/\.tests?$/, "")
    .replace(/^EventEmitterOnceStaticTests$/, "event-emitter-once-static")
    .replace(/^execPath$/, "exec-path")
    .replace(/^exitCode$/, "exit-code")
    .replace(/^isAbsolute$/, "is-absolute")
    .replace(/^matchesGlob$/, "matches-glob")
    .replace(/^pathModule$/, "path-module")
    .replace(/^toNamespacedPath$/, "to-namespaced-path")
    .replace(/^eventNames$/, "event-names")
    .replace(/^getMaxListeners$/, "get-max-listeners")
    .replace(/^listenerCount$/, "listener-count")
    .replace(/^newListener$/, "new-listener")
    .replace(/^prependListener$/, "prepend-listener")
    .replace(/^prependOnceListener$/, "prepend-once-listener")
    .replace(/^rawListeners$/, "raw-listeners")
    .replace(/^removeAllListeners$/, "remove-all-listeners")
    .replace(/^removeListener$/, "remove-listener")
    .replace(/^setMaxListeners$/, "set-max-listeners")
    .replace(/^addListener$/, "add-listener")
    .replace(/^events\.module$/, "events-module");

const collectSelftestNames = (moduleName) =>
  readdirSync(join(selftestRoot, moduleName))
    .filter((name) => name.endsWith(".test.ts"))
    .map((name) => name.replace(/\.test\.ts$/, ""))
    .sort();

const countClrFacts = (filePath) =>
  (readFileSync(filePath, "utf8").match(/\[(Fact|Theory)\b/g) ?? []).length;

const countSelftestFacts = (filePath) =>
  (
    readFileSync(filePath, "utf8").match(/\.add\((FactAttribute|TheoryAttribute)\)/g) ??
    []
  ).length;

const moduleDirs = readdirSync(clrTestsRoot)
  .map((name) => join(clrTestsRoot, name))
  .filter((path) => statSync(path).isDirectory())
  .map((path) => ({
    name: path.slice(path.lastIndexOf("/") + 1),
    path,
  }))
  .filter(({ name }) => name !== "TestResults")
  .sort((a, b) => a.name.localeCompare(b.name));

let implementedCount = 0;
let pendingCount = 0;
let parityFailures = 0;

for (const moduleDir of moduleDirs) {
  const clrFileNames = readdirSync(moduleDir.path).filter((name) =>
    name.endsWith(".cs")
  );
  const fileCount = clrFileNames.length;
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

  if (!implemented) {
    continue;
  }

  const clrNames = clrFileNames.map(normalizeClrTestStem).sort();
  const selftestNames = collectSelftestNames(moduleDir.name);
  const missingFromSelftest = clrNames.filter((name) => !selftestNames.includes(name));
  const extraSelftests = selftestNames.filter((name) => !clrNames.includes(name));
  const hasExactFileParity =
    missingFromSelftest.length === 0 && extraSelftests.length === 0;
  console.log(
    hasExactFileParity
      ? "  selftest file parity: exact match"
      : `  selftest file parity: missing=[${missingFromSelftest.join(", ")}] extra=[${extraSelftests.join(", ")}]`
  );
  if (!hasExactFileParity) {
    parityFailures += 1;
  }

  const factDiffs = clrFileNames
    .map((clrFileName) => {
      const stem = normalizeClrTestStem(clrFileName);
      const clrFacts = countClrFacts(join(moduleDir.path, clrFileName));
      const selftestFile = join(selftestRoot, moduleDir.name, `${stem}.test.ts`);
      const selftestFacts = countSelftestFacts(selftestFile);
      return {
        stem,
        clrFacts,
        selftestFacts,
      };
    })
    .filter(({ clrFacts, selftestFacts }) => clrFacts !== selftestFacts);

  console.log(
    factDiffs.length === 0
      ? "  selftest fact parity: exact match"
      : `  selftest fact parity: diffs=[${factDiffs
          .map(
            ({ stem, clrFacts, selftestFacts }) =>
              `${stem}:clr=${clrFacts},ts=${selftestFacts}`
          )
          .join("; ")}]`
  );
  if (factDiffs.length > 0) {
    parityFailures += 1;
  }
}

console.log("");
console.log(`implemented modules: ${implementedCount}`);
console.log(`pending modules:     ${pendingCount}`);

if (parityFailures > 0) {
  process.exitCode = 1;
}
