import { attributes as A } from "@tsonic/core/lang.js";
import { Assert, FactAttribute } from "xunit-types/Xunit.js";

import * as net from "@tsonic/nodejs/net.js";

export class CreateConnectionTests {
  public create_connection_creates_socket(): void {
    const socket = net.createConnection(18234, "localhost");
    Assert.NotNull(socket);
    Assert.True(socket instanceof net.Socket);
  }
}

A.on(CreateConnectionTests)
  .method((t) => t.create_connection_creates_socket)
  .add(FactAttribute);
