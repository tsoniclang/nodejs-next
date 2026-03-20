import { attributes as A } from "@tsonic/core/lang.js";
import { Assert, FactAttribute } from "xunit-types/Xunit.js";

import * as nodePath from "@tsonic/nodejs/path.js";

export class NodejsNextIntegrationTests {
  public path_subpath_namespace_import_smoke(): void {
    const joined = nodePath.join("root", "sub", "file.txt");
    const parsed = nodePath.parse(joined);

    Assert.Equal("file.txt", nodePath.basename(joined));
    Assert.Equal(".txt", nodePath.extname(joined));
    Assert.Equal("file.txt", parsed.base);
  }
}

A.on(NodejsNextIntegrationTests)
  .method((t) => t.path_subpath_namespace_import_smoke)
  .add(FactAttribute);
