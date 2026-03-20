import { attributes as A } from "@tsonic/core/lang.js";
import { Assert, FactAttribute } from "xunit-types/Xunit.js";

import { process } from "@tsonic/nodejs/process.js";

export class ProcessVersionTests {
  public version_has_tsonic_prefix_and_identifier(): void {
    Assert.True(process.version.startsWith("v"));
    Assert.True(process.version.toLowerCase().includes("tsonic"));
  }

  public versions_object_has_expected_fields(): void {
    Assert.True(process.versions.node.length > 0);
    Assert.True(process.versions.v8.length > 0);
    Assert.True(process.versions.dotnet.length > 0);
    Assert.True(process.versions.tsonic.length > 0);
  }
}

A.on(ProcessVersionTests)
  .method((t) => t.version_has_tsonic_prefix_and_identifier)
  .add(FactAttribute);
A.on(ProcessVersionTests)
  .method((t) => t.versions_object_has_expected_fields)
  .add(FactAttribute);
