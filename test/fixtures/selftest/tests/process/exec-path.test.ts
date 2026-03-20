import { attributes as A } from "@tsonic/core/lang.js";
import { Assert, FactAttribute } from "xunit-types/Xunit.js";
import { Path } from "@tsonic/dotnet/System.IO.js";

import { process } from "@tsonic/nodejs/process.js";

import { assertFileExists } from "./helpers.ts";

export class ProcessExecPathTests {
  public execPath_is_non_empty_absolute_existing_path(): void {
    Assert.True(process.execPath.length > 0);
    Assert.True(Path.IsPathRooted(process.execPath));
    assertFileExists(process.execPath);
  }
}

A.on(ProcessExecPathTests)
  .method((t) => t.execPath_is_non_empty_absolute_existing_path)
  .add(FactAttribute);
