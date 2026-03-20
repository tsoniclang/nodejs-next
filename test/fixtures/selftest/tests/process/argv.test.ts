import { attributes as A } from "@tsonic/core/lang.js";
import { Assert, FactAttribute } from "xunit-types/Xunit.js";

import { process } from "@tsonic/nodejs/process.js";

export class ProcessArgvTests {
  public argv_is_available_and_settable(): void {
    const original = process.argv;
    const next = ["test", "args"];

    try {
      Assert.True(original !== undefined);
      process.argv = next;
      Assert.Equal(next.length, process.argv.length);
      Assert.Equal("test", process.argv[0]);
      Assert.Equal("args", process.argv[1]);
    } finally {
      process.argv = original;
    }
  }

  public argv_handles_undefined_by_becoming_empty(): void {
    const original = process.argv;

    try {
      process.argv = undefined;
      Assert.Equal(0, process.argv.length);
    } finally {
      process.argv = original;
    }
  }

  public argv0_is_available_and_settable(): void {
    const original = process.argv0;

    try {
      process.argv0 = "test-executable";
      Assert.Equal("test-executable", process.argv0);

      process.argv0 = undefined;
      Assert.Equal("", process.argv0);
    } finally {
      process.argv0 = original;
    }
  }
}

A.on(ProcessArgvTests)
  .method((t) => t.argv_is_available_and_settable)
  .add(FactAttribute);
A.on(ProcessArgvTests)
  .method((t) => t.argv_handles_undefined_by_becoming_empty)
  .add(FactAttribute);
A.on(ProcessArgvTests)
  .method((t) => t.argv0_is_available_and_settable)
  .add(FactAttribute);
