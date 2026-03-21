/**
 * DgramSocket — UDP socket for sending and receiving datagrams.
 *
 * Baseline: nodejs-clr/src/nodejs/dgram/Socket.cs
 *
 * NOTE: All OS-level UDP interop is deferred with TODO markers.
 * The class shape faithfully mirrors the Node.js dgram.Socket API.
 */

import { EventEmitter } from "../events-module.ts";
import { stringToBytes } from "../buffer/buffer-encoding.ts";
import { RemoteInfo } from "./remote-info.ts";
import { SocketOptions, BindOptions } from "./socket-options.ts";

/** Address information returned by socket.address() and socket.remoteAddress(). */
export class AddressInfo {
  public address: string = "";
  public family: string = "IPv4";
  public port: number = 0;
}

export class DgramSocket extends EventEmitter {
  private readonly _type: string;
  private readonly _options: SocketOptions;
  private _isBound: boolean = false;
  private _isClosed: boolean = false;
  private _isConnected: boolean = false;
  private _localAddress: AddressInfo | undefined = undefined;
  private _remoteAddress: AddressInfo | undefined = undefined;

  constructor(type: string, callback?: (msg: Uint8Array, rinfo: RemoteInfo) => void);
  constructor(options: SocketOptions, callback?: (msg: Uint8Array, rinfo: RemoteInfo) => void);
  constructor(
    typeOrOptions: string | SocketOptions,
    callback?: (msg: Uint8Array, rinfo: RemoteInfo) => void,
  ) {
    super();

    if (typeof typeOrOptions === "string") {
      this._type = typeOrOptions;
      this._options = new SocketOptions();
      this._options.type = typeOrOptions;
    } else {
      this._type = typeOrOptions.type;
      this._options = typeOrOptions;
    }

    if (callback !== undefined) {
      this.on("message", callback as (...args: unknown[]) => void);
    }
  }

  /**
   * Returns an object containing the address information for a socket.
   */
  address(): AddressInfo {
    if (!this._isBound) {
      throw new Error("Socket is not bound");
    }

    // TODO: OS interop — read actual local endpoint from native UDP socket
    return this._localAddress!;
  }

  /**
   * Causes the socket to listen for datagram messages on a named port and optional address.
   */
  bind(port?: number, address?: string, callback?: () => void): DgramSocket;
  bind(port: number, callback: () => void): DgramSocket;
  bind(callback: () => void): DgramSocket;
  bind(options: BindOptions, callback?: () => void): DgramSocket;
  bind(
    portOrCallbackOrOptions?: number | (() => void) | BindOptions,
    addressOrCallback?: string | (() => void),
    callback?: () => void,
  ): DgramSocket {
    if (this._isBound) {
      throw new Error("Socket is already bound");
    }

    let port: number = 0;
    let address: string | undefined = undefined;
    let cb: (() => void) | undefined = undefined;

    if (typeof portOrCallbackOrOptions === "function") {
      // bind(callback)
      cb = portOrCallbackOrOptions;
    } else if (
      typeof portOrCallbackOrOptions === "object" &&
      portOrCallbackOrOptions !== null &&
      portOrCallbackOrOptions !== undefined
    ) {
      // bind(options, callback?)
      const options = portOrCallbackOrOptions as BindOptions;

      if (options.fd !== undefined) {
        throw new Error("File descriptor binding is not supported");
      }

      port = options.port ?? 0;
      address = options.address;
      cb = typeof addressOrCallback === "function" ? addressOrCallback : callback;
    } else {
      // bind(port?, address?, callback?)
      port = (portOrCallbackOrOptions as number | undefined) ?? 0;

      if (typeof addressOrCallback === "function") {
        cb = addressOrCallback;
      } else {
        address = addressOrCallback;
        cb = callback;
      }
    }

    try {
      // TODO: OS interop — create native UDP socket and bind to port/address
      // Apply socket options: _options.reuseAddr, _options.recvBufferSize, _options.sendBufferSize
      // Determine address family from _type ("udp4" → IPv4, "udp6" → IPv6)

      const bindAddress =
        address !== undefined && address !== null
          ? address
          : this._type === "udp6"
            ? "::"
            : "0.0.0.0";

      this._localAddress = new AddressInfo();
      this._localAddress.address = bindAddress;
      this._localAddress.family = this._type === "udp6" ? "IPv6" : "IPv4";
      this._localAddress.port = port;
      this._isBound = true;

      // TODO: OS interop — start receiving messages on background thread

      this.emit("listening");

      if (cb !== undefined) {
        cb();
      }
    } catch (ex: unknown) {
      this.emit("error", ex);
    }

    return this;
  }

  /**
   * Close the underlying socket and stop listening for data on it.
   */
  close(callback?: () => void): DgramSocket {
    if (this._isClosed) {
      return this;
    }

    this._isClosed = true;

    // TODO: OS interop — close and dispose native UDP socket

    this.emit("close");

    if (callback !== undefined) {
      callback();
    }

    return this;
  }

  /**
   * Associates the socket to a remote address and port.
   */
  connect(port: number, address?: string, callback?: () => void): void;
  connect(port: number, callback: () => void): void;
  connect(
    port: number,
    addressOrCallback?: string | (() => void),
    callback?: () => void,
  ): void {
    if (this._isConnected) {
      throw new Error("Socket is already connected");
    }

    let address: string | undefined = undefined;
    let cb: (() => void) | undefined = undefined;

    if (typeof addressOrCallback === "function") {
      cb = addressOrCallback;
    } else {
      address = addressOrCallback;
      cb = callback;
    }

    try {
      if (address === undefined || address === null) {
        address = this._type === "udp6" ? "::1" : "127.0.0.1";
      }

      // Auto-bind if not already bound
      if (!this._isBound) {
        this.bind();
      }

      // TODO: OS interop — connect native UDP socket to remote endpoint

      this._remoteAddress = new AddressInfo();
      this._remoteAddress.address = address;
      this._remoteAddress.family = this._type === "udp6" ? "IPv6" : "IPv4";
      this._remoteAddress.port = port;
      this._isConnected = true;

      this.emit("connect");

      if (cb !== undefined) {
        cb();
      }
    } catch (ex: unknown) {
      this.emit("error", ex);

      if (cb !== undefined) {
        cb();
      }
    }
  }

  /**
   * Disassociates a connected socket from its remote address.
   */
  disconnect(): void {
    if (!this._isConnected) {
      throw new Error("Socket is not connected");
    }

    this._remoteAddress = undefined;
    this._isConnected = false;
  }

  /**
   * Broadcasts a datagram on the socket.
   */
  send(
    msg: Uint8Array | string,
    port?: number,
    address?: string,
    callback?: (error: Error | null, bytes: number) => void,
  ): void;
  send(
    msg: Uint8Array | string,
    port: number,
    callback: (error: Error | null, bytes: number) => void,
  ): void;
  send(
    msg: Uint8Array | string,
    callback: (error: Error | null, bytes: number) => void,
  ): void;
  send(
    msg: Uint8Array,
    offset: number,
    length: number,
    port?: number,
    address?: string,
    callback?: (error: Error | null, bytes: number) => void,
  ): void;
  send(
    msg: Uint8Array,
    offset: number,
    length: number,
    port: number,
    callback: (error: Error | null, bytes: number) => void,
  ): void;
  send(
    msg: Uint8Array,
    offset: number,
    length: number,
    callback: (error: Error | null, bytes: number) => void,
  ): void;
  send(
    msg: Uint8Array | string,
    arg1?:
      | number
      | ((error: Error | null, bytes: number) => void),
    arg2?:
      | number
      | string
      | ((error: Error | null, bytes: number) => void),
    arg3?:
      | number
      | string
      | ((error: Error | null, bytes: number) => void),
    arg4?: string | ((error: Error | null, bytes: number) => void),
    arg5?: (error: Error | null, bytes: number) => void,
  ): void {
    const args: unknown[] = [];
    if (arg1 !== undefined) args.push(arg1);
    if (arg2 !== undefined) args.push(arg2);
    if (arg3 !== undefined) args.push(arg3);
    if (arg4 !== undefined) args.push(arg4);
    if (arg5 !== undefined) args.push(arg5);

    // Parse the complex overloaded signature
    const parsed = parseSendArgs(msg, args);

    try {
      if (!this._isBound) {
        // Auto-bind if not bound
        this.bind();
      }

      const bytes = parsed.data;
      const bytesSent = bytes.length;

      if (this._isConnected) {
        // TODO: OS interop — send data via connected native UDP socket
      } else {
        if (parsed.port === undefined) {
          throw new Error("Port must be specified for unconnected socket");
        }

        // TODO: OS interop — send data to specified endpoint via native UDP socket
      }

      if (parsed.callback !== undefined) {
        parsed.callback(null, bytesSent);
      }
    } catch (ex: unknown) {
      const error = ex instanceof Error ? ex : new Error(String(ex));
      this.emit("error", error);

      if (parsed.callback !== undefined) {
        parsed.callback(error, 0);
      }
    }
  }

  /**
   * Sets or clears the SO_BROADCAST socket option.
   */
  setBroadcast(flag: boolean): void {
    if (!this._isBound) {
      throw new Error("Socket is not bound");
    }

    // TODO: OS interop — set SO_BROADCAST on native socket
    void flag;
  }

  /**
   * Sets the IP_MULTICAST_TTL socket option.
   */
  setMulticastTTL(ttl: number): number {
    if (!this._isBound) {
      throw new Error("Socket is not bound");
    }

    if (ttl < 0 || ttl > 255) {
      throw new Error("TTL must be between 0 and 255");
    }

    // TODO: OS interop — set IP_MULTICAST_TTL on native socket
    return ttl;
  }

  /**
   * Sets or clears the IP_MULTICAST_LOOP socket option.
   */
  setMulticastLoopback(flag: boolean): boolean {
    if (!this._isBound) {
      throw new Error("Socket is not bound");
    }

    // TODO: OS interop — set IP_MULTICAST_LOOP on native socket
    return flag;
  }

  /**
   * Tells the kernel to join a multicast group.
   */
  addMembership(multicastAddress: string, multicastInterface?: string): void {
    if (!this._isBound) {
      // Auto-bind if not bound
      this.bind();
    }

    // TODO: OS interop — join multicast group on native socket
    void multicastAddress;
    void multicastInterface;
  }

  /**
   * Instructs the kernel to leave a multicast group.
   */
  dropMembership(multicastAddress: string): void {
    if (!this._isBound) {
      throw new Error("Socket is not bound");
    }

    // TODO: OS interop — leave multicast group on native socket
    void multicastAddress;
  }

  /**
   * Sets the default outgoing multicast interface of the socket.
   */
  setMulticastInterface(multicastInterface: string): void {
    if (!this._isBound) {
      throw new Error("Socket is not bound");
    }

    // TODO: OS interop — set multicast interface on native socket
    void multicastInterface;
  }

  /**
   * Sets the IP_TTL socket option.
   */
  setTTL(ttl: number): number {
    if (!this._isBound) {
      throw new Error("Socket is not bound");
    }

    if (ttl < 1 || ttl > 255) {
      throw new Error("TTL must be between 1 and 255");
    }

    // TODO: OS interop — set IP_TTL on native socket
    return ttl;
  }

  /**
   * Gets the number of bytes queued for sending.
   * Note: Returns 0 as a stub — not available without native socket.
   */
  getSendQueueSize(): number {
    return 0;
  }

  /**
   * Gets the number of send requests currently in the queue.
   * Note: Returns 0 as a stub — not available without native socket.
   */
  getSendQueueCount(): number {
    return 0;
  }

  /**
   * Adds the socket back to reference counting.
   * Note: No-op for API compatibility.
   */
  ref(): DgramSocket {
    return this;
  }

  /**
   * Excludes the socket from reference counting.
   * Note: No-op for API compatibility.
   */
  unref(): DgramSocket {
    return this;
  }

  /**
   * Tells the kernel to join a source-specific multicast channel.
   */
  addSourceSpecificMembership(
    sourceAddress: string,
    groupAddress: string,
    multicastInterface?: string,
  ): void {
    if (!this._isBound) {
      this.bind();
    }

    // TODO: OS interop — source-specific multicast not widely supported
    void sourceAddress;
    void groupAddress;
    void multicastInterface;
    throw new Error("Source-specific multicast is not supported");
  }

  /**
   * Instructs the kernel to leave a source-specific multicast channel.
   */
  dropSourceSpecificMembership(
    sourceAddress: string,
    groupAddress: string,
    multicastInterface?: string,
  ): void {
    if (!this._isBound) {
      throw new Error("Socket is not bound");
    }

    // TODO: OS interop — source-specific multicast not widely supported
    void sourceAddress;
    void groupAddress;
    void multicastInterface;
    throw new Error("Source-specific multicast is not supported");
  }

  /**
   * Sets the SO_RCVBUF socket receive buffer size.
   */
  setRecvBufferSize(size: number): void {
    if (!this._isBound) {
      throw new Error("Socket is not bound");
    }

    // TODO: OS interop — set SO_RCVBUF on native socket
    void size;
  }

  /**
   * Sets the SO_SNDBUF socket send buffer size.
   */
  setSendBufferSize(size: number): void {
    if (!this._isBound) {
      throw new Error("Socket is not bound");
    }

    // TODO: OS interop — set SO_SNDBUF on native socket
    void size;
  }

  /**
   * Gets the SO_RCVBUF socket receive buffer size.
   */
  getRecvBufferSize(): number {
    if (!this._isBound) {
      throw new Error("Socket is not bound");
    }

    // TODO: OS interop — read SO_RCVBUF from native socket
    return 65536;
  }

  /**
   * Gets the SO_SNDBUF socket send buffer size.
   */
  getSendBufferSize(): number {
    if (!this._isBound) {
      throw new Error("Socket is not bound");
    }

    // TODO: OS interop — read SO_SNDBUF from native socket
    return 65536;
  }

  /**
   * Returns the remote endpoint information.
   */
  remoteAddress(): AddressInfo {
    if (!this._isConnected || this._remoteAddress === undefined) {
      throw new Error("Socket is not connected");
    }

    return this._remoteAddress;
  }
}

/** Parsed arguments for the send() method. */
type ParsedSendArgs = {
  readonly data: Uint8Array;
  readonly port: number | undefined;
  readonly address: string | undefined;
  readonly callback: ((error: Error | null, bytes: number) => void) | undefined;
};

const copyRange = (data: Uint8Array, start: number, end: number): Uint8Array => {
  const result = new Uint8Array(end - start);
  for (let index = 0; index < result.length; index += 1) {
    result[index] = data[start + index]!;
  }
  return result;
};

const toBytes = (msg: Uint8Array | string): Uint8Array => {
  if (typeof msg === "string") {
    return stringToBytes(msg, "utf8");
  }
  return msg;
};

/**
 * Parses the complex overloaded send() arguments into a normalized structure.
 */
const parseSendArgs = (
  msg: Uint8Array | string,
  args: readonly unknown[],
): ParsedSendArgs => {
  // send(msg) — no extra args
  if (args.length === 0) {
    return { data: toBytes(msg), port: undefined, address: undefined, callback: undefined };
  }

  // send(msg, callback)
  if (args.length === 1 && typeof args[0] === "function") {
    return {
      data: toBytes(msg),
      port: undefined,
      address: undefined,
      callback: args[0] as (error: Error | null, bytes: number) => void,
    };
  }

  // Check if this is the offset/length form: send(msg, offset, length, ...)
  // This form is only valid when msg is Uint8Array and args[0] and args[1] are numbers
  if (
    msg instanceof Uint8Array &&
    args.length >= 2 &&
    typeof args[0] === "number" &&
    typeof args[1] === "number"
  ) {
    const offset = args[0];
    const length = args[1];

    if (offset < 0 || offset >= msg.length) {
      throw new RangeError("Offset must be within buffer bounds");
    }
    if (length < 0 || offset + length > msg.length) {
      throw new RangeError("Length must be within buffer bounds");
    }

    const slice = copyRange(msg, offset, offset + length);
    const remaining = args.slice(2);

    // send(msg, offset, length)
    if (remaining.length === 0) {
      return { data: slice, port: undefined, address: undefined, callback: undefined };
    }

    // send(msg, offset, length, callback)
    if (remaining.length === 1 && typeof remaining[0] === "function") {
      return {
        data: slice,
        port: undefined,
        address: undefined,
        callback: remaining[0] as (error: Error | null, bytes: number) => void,
      };
    }

    // send(msg, offset, length, port, ...)
    if (typeof remaining[0] === "number") {
      const port = remaining[0];
      const rest = remaining.slice(1);

      // send(msg, offset, length, port)
      if (rest.length === 0) {
        return { data: slice, port, address: undefined, callback: undefined };
      }

      // send(msg, offset, length, port, callback)
      if (rest.length === 1 && typeof rest[0] === "function") {
        return {
          data: slice,
          port,
          address: undefined,
          callback: rest[0] as (error: Error | null, bytes: number) => void,
        };
      }

      // send(msg, offset, length, port, address, callback?)
      const address = rest[0] as string | undefined;
      const cb = rest.length > 1
        ? (rest[1] as ((error: Error | null, bytes: number) => void) | undefined)
        : undefined;
      return { data: slice, port, address, callback: cb };
    }

    return { data: slice, port: undefined, address: undefined, callback: undefined };
  }

  // Non-offset form: send(msg, port?, address?, callback?)
  const data = toBytes(msg);

  // send(msg, port, ...)
  if (typeof args[0] === "number") {
    const port = args[0];
    const rest = args.slice(1);

    // send(msg, port)
    if (rest.length === 0) {
      return { data, port, address: undefined, callback: undefined };
    }

    // send(msg, port, callback)
    if (rest.length === 1 && typeof rest[0] === "function") {
      return {
        data,
        port,
        address: undefined,
        callback: rest[0] as (error: Error | null, bytes: number) => void,
      };
    }

    // send(msg, port, address, callback?)
    const address = rest[0] as string | undefined;
    const cb = rest.length > 1
      ? (rest[1] as ((error: Error | null, bytes: number) => void) | undefined)
      : undefined;
    return { data, port, address, callback: cb };
  }

  return { data, port: undefined, address: undefined, callback: undefined };
};
