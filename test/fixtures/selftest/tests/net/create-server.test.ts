import { attributes as A } from "@tsonic/core/lang.js";
import { Assert, FactAttribute } from "xunit-types/Xunit.js";

import * as net from "@tsonic/nodejs/net.js";

export class CreateServerTests {
  public create_server_no_args_returns_server(): void {
    const server = net.createServer();
    Assert.NotNull(server);
    Assert.True(server instanceof net.Server);
  }

  public create_server_with_connection_listener_attaches_listener(): void {
    const server = net.createServer((_socket: net.Socket) => {
      // Listener attached
    });
    Assert.NotNull(server);
  }

  public create_server_with_options_returns_server(): void {
    const options = new net.ServerOpts();
    options.allowHalfOpen = true;
    const server = net.createServer(options);
    Assert.NotNull(server);
  }
}

A.on(CreateServerTests)
  .method((t) => t.create_server_no_args_returns_server)
  .add(FactAttribute);
A.on(CreateServerTests)
  .method((t) => t.create_server_with_connection_listener_attaches_listener)
  .add(FactAttribute);
A.on(CreateServerTests)
  .method((t) => t.create_server_with_options_returns_server)
  .add(FactAttribute);
