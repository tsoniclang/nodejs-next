import { attributes as A } from "@tsonic/core/lang.js";
import { Assert, FactAttribute } from "xunit-types/Xunit.js";
import { Directory, Path } from "@tsonic/dotnet/System.IO.js";

import { process } from "@tsonic/nodejs/process.js";

import { assertThrows, createTempDir, deleteIfExists } from "./helpers.ts";

export class ProcessChdirTests {
  public chdir_changes_current_directory(): void {
    const original = Directory.GetCurrentDirectory();
    const target = createTempDir();

    try {
      process.chdir(target);
      Assert.Equal(target, process.cwd());
      Assert.Equal(target, Directory.GetCurrentDirectory());
    } finally {
      Directory.SetCurrentDirectory(original);
      deleteIfExists(target);
    }
  }

  public chdir_supports_relative_paths(): void {
    const original = Directory.GetCurrentDirectory();
    const target = createTempDir();
    const child = Path.Combine(target, "subdir");
    Directory.CreateDirectory(child);

    try {
      process.chdir(target);
      process.chdir("subdir");
      Assert.Equal(child, process.cwd());
    } finally {
      Directory.SetCurrentDirectory(original);
      deleteIfExists(target);
    }
  }

  public chdir_rejects_invalid_inputs(): void {
    assertThrows(() => process.chdir(""));
    assertThrows(() => process.chdir(Path.Combine(Path.GetTempPath(), "does-not-exist-nodejs-next")));
  }
}

A.on(ProcessChdirTests)
  .method((t) => t.chdir_changes_current_directory)
  .add(FactAttribute);
A.on(ProcessChdirTests)
  .method((t) => t.chdir_supports_relative_paths)
  .add(FactAttribute);
A.on(ProcessChdirTests)
  .method((t) => t.chdir_rejects_invalid_inputs)
  .add(FactAttribute);
