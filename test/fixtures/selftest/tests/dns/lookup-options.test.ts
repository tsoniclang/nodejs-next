import { attributes as A } from "@tsonic/core/lang.js";
import { Assert, FactAttribute } from "xunit-types/Xunit.js";

import { LookupOptions, ADDRCONFIG } from "@tsonic/nodejs/dns.js";

export class LookupOptionsTests {
  public LookupOptions_AllProperties_CanBeSet(): void {
    const options = new LookupOptions();
    options.family = 4;
    options.hints = ADDRCONFIG;
    options.all = true;
    options.order = "ipv4first";
    options.verbatim = false;

    Assert.Equal(4, options.family);
    Assert.Equal(ADDRCONFIG, options.hints);
    Assert.True(options.all);
    Assert.Equal("ipv4first", options.order);
    Assert.False(options.verbatim);
  }
}

A.on(LookupOptionsTests)
  .method((t) => t.LookupOptions_AllProperties_CanBeSet)
  .add(FactAttribute);
