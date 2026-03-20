import { attributes as A } from "@tsonic/core/lang.js";
import { Assert, FactAttribute } from "xunit-types/Xunit.js";

import * as nodePath from "@tsonic/nodejs/path.js";
import { Path } from "@tsonic/dotnet/System.IO.js";

export class PathModuleTests {
  public separator_and_delimiter_match_platform_values(): void {
    Assert.Equal(Path.DirectorySeparatorChar, nodePath.sep);
    Assert.Equal(Path.PathSeparator, nodePath.delimiter);
  }

  public named_exports_behave_like_a_namespace_module(): void {
    Assert.Equal("file.txt", nodePath.basename("file.txt"));
    Assert.Equal("/foo", nodePath.dirname("/foo/bar"));
    Assert.Equal(".txt", nodePath.extname("file.txt"));
  }

  public namespace_module_combines_parsing_and_formatting(): void {
    const parsed = nodePath.parse("/foo/bar/file.txt");
    Assert.Equal("/foo/bar/file.txt", nodePath.format(parsed));
  }
}

A.on(PathModuleTests)
  .method((t) => t.separator_and_delimiter_match_platform_values)
  .add(FactAttribute);
A.on(PathModuleTests)
  .method((t) => t.named_exports_behave_like_a_namespace_module)
  .add(FactAttribute);
A.on(PathModuleTests)
  .method((t) => t.namespace_module_combines_parsing_and_formatting)
  .add(FactAttribute);
