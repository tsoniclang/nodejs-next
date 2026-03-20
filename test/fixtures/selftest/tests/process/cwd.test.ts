import { attributes as A } from "@tsonic/core/lang.js";
import { Assert, FactAttribute } from "xunit-types/Xunit.js";
import { Directory, Path } from "@tsonic/dotnet/System.IO.js";

import { process } from "@tsonic/nodejs/process.js";

export class ProcessCwdTests {
  public cwd_matches_dotnet_and_is_absolute(): void {
    const cwd = process.cwd();
    Assert.Equal(Directory.GetCurrentDirectory(), cwd);
    Assert.True(Path.IsPathRooted(cwd));
    Assert.True(Directory.Exists(cwd));
  }
}

A.on(ProcessCwdTests)
  .method((t) => t.cwd_matches_dotnet_and_is_absolute)
  .add(FactAttribute);
