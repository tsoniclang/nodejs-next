/**
 * net.Server — TCP/IPC server.
 *
 * Baseline: nodejs-clr/src/nodejs/net/Server.cs
 *
 * This is substrate-heavy: actual TCP listening requires OS interop via .NET TcpListener.
 * Method signatures are correct; implementations that require OS interop use
 * TODO placeholders.
 */
import { EventEmitter } from "../events-module.ts";
import type { ListenOptions, ServerOpts } from "./options.ts";
import type { Socket } from "./socket.ts";

/**
 * This class is used to create a TCP or IPC server.
 */
export class Server extends EventEmitter {
  private _listening: boolean = false;
  private _maxConnections: number = 0;
  private _connections: number = 0;
  private readonly _allowHalfOpen: boolean;
  private readonly _pauseOnConnect: boolean;

  /**
   * Set to true when the server is listening for connections.
   */
  public get listening(): boolean {
    return this._listening;
  }

  /**
   * The maximum number of connections.
   */
  public get maxConnections(): number {
    return this._maxConnections;
  }

  public set maxConnections(value: number) {
    this._maxConnections = value;
  }

  constructor(
    optionsOrListener?: ServerOpts | ((socket: Socket) => void),
    connectionListener?: ((socket: Socket) => void)
  ) {
    super();

    if (typeof optionsOrListener === "function") {
      // Server(connectionListener)
      this._allowHalfOpen = false;
      this._pauseOnConnect = false;
      this.on("connection", optionsOrListener);
    } else {
      // Server(options?, connectionListener?)
      this._allowHalfOpen = optionsOrListener?.allowHalfOpen ?? false;
      this._pauseOnConnect = optionsOrListener?.pauseOnConnect ?? false;
      if (connectionListener !== undefined) {
        this.on("connection", connectionListener);
      }
    }
  }

  /**
   * Start a server listening for connections.
   */
  public listen(
    port: number,
    hostname: string,
    backlog: number,
    listeningListener?: () => void
  ): Server;
  public listen(
    port: number,
    hostname: string,
    listeningListener?: () => void
  ): Server;
  public listen(
    port: number,
    backlog: number,
    listeningListener?: () => void
  ): Server;
  public listen(port: number, listeningListener?: () => void): Server;
  public listen(
    options: ListenOptions,
    listeningListener?: () => void
  ): Server;
  public listen(
    portOrOptions: number | ListenOptions,
    hostnameOrBacklogOrListener?: string | number | (() => void),
    backlogOrListener?: number | (() => void),
    listeningListener?: () => void
  ): Server {
    if (typeof portOrOptions === "object") {
      // listen(options, listeningListener?)
      const options = portOrOptions;
      const listener =
        typeof hostnameOrBacklogOrListener === "function"
          ? hostnameOrBacklogOrListener
          : undefined;

      if (options.port !== undefined) {
        return this.listenInternal(
          options.port,
          options.host,
          options.backlog ?? 511,
          listener
        );
      }
      if (options.path !== undefined) {
        // TODO: IPC server support
        throw new Error("IPC server not supported");
      }
      throw new Error("Either port or path must be specified");
    }

    const port = portOrOptions;

    if (typeof hostnameOrBacklogOrListener === "string") {
      // listen(port, hostname, ...)
      const hostname = hostnameOrBacklogOrListener;
      if (typeof backlogOrListener === "number") {
        // listen(port, hostname, backlog, listeningListener?)
        return this.listenInternal(
          port,
          hostname,
          backlogOrListener,
          listeningListener
        );
      }
      // listen(port, hostname, listeningListener?)
      return this.listenInternal(
        port,
        hostname,
        511,
        typeof backlogOrListener === "function"
          ? backlogOrListener
          : undefined
      );
    }

    if (typeof hostnameOrBacklogOrListener === "number") {
      // listen(port, backlog, listeningListener?)
      return this.listenInternal(
        port,
        undefined,
        hostnameOrBacklogOrListener,
        typeof backlogOrListener === "function"
          ? backlogOrListener
          : undefined
      );
    }

    // listen(port, listeningListener?)
    return this.listenInternal(
      port,
      undefined,
      511,
      typeof hostnameOrBacklogOrListener === "function"
        ? hostnameOrBacklogOrListener
        : undefined
    );
  }

  private listenInternal(
    _port: number,
    _hostname: string | undefined,
    _backlog: number,
    listeningListener: (() => void) | undefined
  ): Server {
    if (this._listening) {
      throw new Error("Server is already listening");
    }

    if (listeningListener !== undefined) {
      this.once("listening", listeningListener);
    }

    // TODO: Create TcpListener and start accepting connections via OS interop.
    // In the CLR version this uses:
    //   var ipAddress = IPAddress.Parse(hostname ?? "0.0.0.0");
    //   _listener = new TcpListener(ipAddress, port);
    //   _listener.Start(backlog);
    //   _listening = true;
    //   emit("listening");
    //   Then starts a background loop calling AcceptTcpClient() to emit "connection" events.

    this._listening = true;
    this.emit("listening");

    return this;
  }

  /**
   * Stops the server from accepting new connections.
   */
  public close(callback?: (err?: Error) => void): Server {
    if (!this._listening) {
      const error = new Error("Server is not listening");
      if (callback !== undefined) {
        callback(error);
      }
      return this;
    }

    this._listening = false;

    // TODO: Stop the TcpListener via OS interop

    if (callback !== undefined) {
      this.once("close", () => callback(undefined));
    }

    this.emit("close");

    return this;
  }

  /**
   * Returns the bound address, the address family name, and port of the server.
   */
  public address(): object | null {
    // TODO: Read address info from the underlying TcpListener via OS interop.
    // In the CLR version this reads _listener.LocalEndpoint as IPEndPoint.
    return null;
  }

  /**
   * Asynchronously get the number of concurrent connections on the server.
   */
  public getConnections(
    callback: (err: Error | undefined, count: number) => void
  ): void {
    callback(undefined, this._connections);
  }

  /**
   * Calling unref() on a server will allow the program to exit if this is the only active server.
   */
  public unref(): Server {
    // Not applicable in managed context
    return this;
  }

  /**
   * Opposite of unref().
   */
  public ref(): Server {
    // Not applicable in managed context
    return this;
  }
}
