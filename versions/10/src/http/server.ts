/**
 * Node.js http.Server — HTTP server implementation.
 *
 * Baseline: nodejs-clr/src/nodejs/http/Server.cs
 *
 * This class requires OS network substrate (TCP listener, HTTP parser) for
 * actual server functionality. Class shape and method signatures are ported;
 * listen/close internals are stubbed with TODO markers.
 */

import type { int } from "@tsonic/core/types.js";
import {
  EventEmitter,
  toBinaryEventListener,
  toEventListener,
} from "../events-module.ts";
import { IncomingMessage } from "./incoming-message.ts";
import { ServerResponse } from "./server-response.ts";

/**
 * Information about a server's bound address.
 */
export class AddressInfo {
  /**
   * The port number the server is listening on.
   */
  public port: int;

  /**
   * The address family (e.g., "IPv4" or "IPv6").
   */
  public family: string;

  /**
   * The IP address the server is listening on.
   */
  public address: string;

  constructor(port: int, family: string, address: string) {
    this.port = port;
    this.family = family;
    this.address = address;
  }
}

/**
 * Implements Node.js http.Server functionality.
 * Extends EventEmitter to support events like 'request', 'connection', 'close', etc.
 */
export class Server extends EventEmitter {
  private _boundAddress: AddressInfo | null = null;
  private _maxHeadersCount: int = 2000 as int;
  private _timeout: int = 0 as int;
  private _headersTimeout: int = 60000 as int;
  private _requestTimeout: int = 300000 as int;
  private _keepAliveTimeout: int = 5000 as int;
  private _listening: boolean = false;

  constructor(
    requestListener?:
      | ((req: IncomingMessage, res: ServerResponse) => void)
      | null
  ) {
    super();

    // If request listener provided, register it as event listener
    if (requestListener !== undefined && requestListener !== null) {
      this.on(
        "request",
        toBinaryEventListener<IncomingMessage, ServerResponse>(requestListener)!
      );
    }
  }

  /**
   * Limits maximum incoming headers count.
   * If set to 0, no limit will be applied.
   */
  public get maxHeadersCount(): int {
    return this._maxHeadersCount;
  }

  public set maxHeadersCount(value: int) {
    this._maxHeadersCount = value;
  }

  /**
   * Sets the timeout value in milliseconds for receiving the entire request.
   * Default: 0 (no timeout)
   */
  public get timeout(): int {
    return this._timeout;
  }

  public set timeout(value: int) {
    if (value < 0) {
      throw new Error("Timeout must be non-negative");
    }
    this._timeout = value;
  }

  /**
   * Limits the amount of time the parser will wait to receive the complete HTTP headers.
   * Default: 60000 (60 seconds)
   */
  public get headersTimeout(): int {
    return this._headersTimeout;
  }

  public set headersTimeout(value: int) {
    if (value < 0) {
      throw new Error("Headers timeout must be non-negative");
    }
    this._headersTimeout = value;
  }

  /**
   * Sets the timeout value in milliseconds for receiving the entire request from the client.
   * Default: 300000 (5 minutes)
   */
  public get requestTimeout(): int {
    return this._requestTimeout;
  }

  public set requestTimeout(value: int) {
    if (value < 0) {
      throw new Error("Request timeout must be non-negative");
    }
    this._requestTimeout = value;
  }

  /**
   * The number of milliseconds of inactivity a server needs to wait for additional data
   * after it has finished writing the last response, before a socket will be destroyed.
   * Default: 5000 (5 seconds)
   */
  public get keepAliveTimeout(): int {
    return this._keepAliveTimeout;
  }

  public set keepAliveTimeout(value: int) {
    if (value < 0) {
      throw new Error("Keep-alive timeout must be non-negative");
    }
    this._keepAliveTimeout = value;
  }

  /**
   * Indicates whether or not the server is listening for connections.
   */
  public get listening(): boolean {
    return this._listening;
  }

  /**
   * Begin accepting connections on the specified port and hostname.
   * @param port - The port number.
   * @param hostname - The hostname. Default: all interfaces.
   * @param backlog - Maximum length of the queue of pending connections.
   * @param callback - Optional callback when server has been started.
   * @returns The server instance for chaining.
   */
  public listen(
    port: int,
    hostname?: string | null,
    backlog?: int | null,
    callback?: (() => void) | null
  ): Server {
    if (this._listening) {
      throw new Error("Server is already listening");
    }

    if (port < 0 || port > 65535) {
      throw new RangeError(
        `port must be >= 0 and <= 65535. Received ${String(port)}`
      );
    }

    if (backlog !== undefined && backlog !== null && backlog < 0) {
      throw new Error("Backlog must be non-negative");
    }

    // TODO: Actually bind to a TCP port using OS network substrate.
    // The CLR version uses Kestrel (ASP.NET Core) here.
    this._listening = true;

    const resolvedHostname =
      hostname !== undefined && hostname !== null ? hostname : "0.0.0.0";
    const family = resolvedHostname.includes(":") ? "IPv6" : "IPv4";

    this._boundAddress = new AddressInfo(
      port,
      family,
      resolvedHostname
    );

    this.emit("listening");

    if (callback !== undefined && callback !== null) {
      callback();
    }

    return this;
  }

  /**
   * Begin accepting connections on the specified port with callback.
   * @param port - The port number.
   * @param callback - Optional callback when server has been started.
   * @returns The server instance for chaining.
   */
  public listenWithCallback(port: int, callback?: (() => void) | null): Server {
    return this.listen(port, null, null, callback);
  }

  /**
   * Begin accepting connections on the specified port and hostname with callback.
   */
  public listenWithHostname(
    port: int,
    hostname: string,
    callback?: (() => void) | null
  ): Server {
    return this.listen(port, hostname, null, callback);
  }

  /**
   * Stops the server from accepting new connections.
   * @param callback - Optional callback when server has closed.
   * @returns The server instance for chaining.
   */
  public close(callback?: (() => void) | null): Server {
    if (!this._listening) {
      if (callback !== undefined && callback !== null) {
        callback();
      }
      return this;
    }

    // TODO: Actually stop the TCP listener using OS network substrate.
    this._boundAddress = null;
    this._listening = false;
    this.emit("close");

    if (callback !== undefined && callback !== null) {
      callback();
    }

    return this;
  }

  /**
   * Sets the timeout value for sockets and emits a 'timeout' event on the Server object.
   * @param msecs - Timeout in milliseconds.
   * @param callback - Optional callback to be added as a listener on the 'timeout' event.
   * @returns The server instance for chaining.
   */
  public setTimeout(msecs: int, callback?: (() => void) | null): Server {
    if (msecs < 0) {
      throw new Error("Timeout must be non-negative");
    }
    this._timeout = msecs;

    if (callback !== undefined && callback !== null) {
      this.on("timeout", toEventListener(callback)!);
    }

    return this;
  }

  /**
   * Returns the bound address, the address family name, and port of the server.
   * Only useful after 'listening' event.
   * @returns An object with 'port', 'family', and 'address' properties, or null.
   */
  public address(): AddressInfo | null {
    return this._boundAddress;
  }
}
