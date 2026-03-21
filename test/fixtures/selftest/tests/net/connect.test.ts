import { attributes as A } from "@tsonic/core/lang.js";
import { Assert, FactAttribute } from "xunit-types/Xunit.js";

import * as net from "@tsonic/nodejs/net.js";

export class NetConnectTests {
  public connect_creates_socket(): void {
    const socket = net.connect(18234, "localhost");
    Assert.NotNull(socket);
    Assert.True(socket instanceof net.Socket);
  }
}

A.on(NetConnectTests)
  .method((t) => t.connect_creates_socket)
  .add(FactAttribute);
