import { attributes as A } from "@tsonic/core/lang.js";
import { Assert, FactAttribute } from "xunit-types/Xunit.js";

import * as nodePath from "@tsonic/nodejs/path.js";

import { assertOneOf } from "./helpers.ts";

export class ExtnameTests {
  public extname_returns_extension(): void {
    Assert.Equal(".html", nodePath.extname("index.html"));
    Assert.Equal(".md", nodePath.extname("index.coffee.md"));
    Assert.Equal("", nodePath.extname("index"));
  }

  public extname_handles_platform_variants(): void {
    assertOneOf(nodePath.extname("index."), [".", ""]);
    assertOneOf(nodePath.extname(".index"), ["", ".index"]);
  }
}

A.on(ExtnameTests).method((t) => t.extname_returns_extension).add(FactAttribute);
A.on(ExtnameTests)
  .method((t) => t.extname_handles_platform_variants)
  .add(FactAttribute);
