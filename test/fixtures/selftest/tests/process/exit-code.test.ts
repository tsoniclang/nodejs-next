import { attributes as A } from "@tsonic/core/lang.js";
import { Assert, FactAttribute } from "xunit-types/Xunit.js";

import { process } from "@tsonic/nodejs/process.js";

export class ProcessExitCodeTests {
  public exitCode_is_settable_and_nullable(): void {
    const original = process.exitCode;

    try {
      process.exitCode = undefined;
      Assert.True(process.exitCode === undefined);

      process.exitCode = 42;
      Assert.Equal(42, process.exitCode);

      process.exitCode = 0;
      Assert.Equal(0, process.exitCode);
    } finally {
      process.exitCode = original;
    }
  }

  public exit_method_exists(): void {
    Assert.True(typeof process.exit === "function");
  }
}

A.on(ProcessExitCodeTests)
  .method((t) => t.exitCode_is_settable_and_nullable)
  .add(FactAttribute);
A.on(ProcessExitCodeTests)
  .method((t) => t.exit_method_exists)
  .add(FactAttribute);
