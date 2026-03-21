/**
 * Node.js http.IncomingMessage — represents an incoming HTTP request (server-side)
 * or response (client-side).
 *
 * Baseline: nodejs-clr/src/nodejs/http/IncomingMessage.cs
 *
 * This class requires OS network substrate for the actual readable-stream body.
 * Class shape and method signatures are ported; body-streaming internals are
 * stubbed with TODO markers.
 */

import type { int } from "@tsonic/core/types.js";
import { EventEmitter } from "../events-module.ts";

/**
 * Represents an incoming HTTP request (server-side) or response (client-side).
 * Extends EventEmitter and implements a simplified readable-stream interface.
 */
export class IncomingMessage extends EventEmitter {
  private _method: string | null;
  private _url: string | null;
  private _httpVersion: string;
  private _statusCode: int | null;
  private _statusMessage: string | null;
  private _headers: Map<string, string>;
  private _complete: boolean = false;

  constructor() {
    super();
    this._method = null;
    this._url = null;
    this._httpVersion = "1.1";
    this._statusCode = null;
    this._statusMessage = null;
    this._headers = new Map<string, string>();
  }

  /**
   * Request method (server-side) or null (client-side).
   */
  public get method(): string | null {
    return this._method;
  }

  /**
   * Request URL (server-side) or null (client-side).
   */
  public get url(): string | null {
    return this._url;
  }

  /**
   * HTTP version sent by the client.
   */
  public get httpVersion(): string {
    return this._httpVersion;
  }

  /**
   * Response status code (client-side) or null (server-side).
   */
  public get statusCode(): int | null {
    return this._statusCode;
  }

  /**
   * Response status message (client-side) or null (server-side).
   */
  public get statusMessage(): string | null {
    return this._statusMessage;
  }

  /**
   * Request/response headers object.
   */
  public get headers(): Map<string, string> {
    return this._headers;
  }

  /**
   * Indicates that the underlying connection was closed.
   */
  public get complete(): boolean {
    return this._complete;
  }

  /**
   * Calls destroy() on the socket that received the IncomingMessage.
   */
  public destroy(): void {
    this._complete = true;
    this.emit("close");
  }

  /**
   * Sets the timeout value in milliseconds for the incoming message.
   * @param msecs - Timeout in milliseconds.
   * @param callback - Optional callback for timeout event.
   * @returns The IncomingMessage instance.
   */
  public setTimeout(msecs: int, callback?: () => void): IncomingMessage {
    if (msecs < 0) {
      throw new Error("Timeout must be non-negative");
    }

    if (callback !== undefined) {
      this.once("timeout", callback);
    }

    // TODO: Implement actual timeout mechanism (requires OS timer substrate)
    return this;
  }

  /**
   * Reads the entire body as a string (simplified implementation).
   * In a full implementation, this would be a streaming interface.
   * @returns The body content as a string.
   */
  public readAll(): Promise<string> {
    // TODO: Implement body reading (requires OS network substrate)
    this._complete = true;
    this.emit("end");
    return Promise.resolve("");
  }

  /**
   * Event handler for 'data' event.
   */
  public onData(callback: (chunk: string) => void): void {
    this.on("data", callback as (...args: unknown[]) => void);
  }

  /**
   * Event handler for 'end' event.
   */
  public onEnd(callback: () => void): void {
    this.on("end", callback);
  }

  /**
   * Event handler for 'close' event.
   */
  public onClose(callback: () => void): void {
    this.on("close", callback);
  }

  // -- Internal setters for server/client construction --

  /** @internal */
  public _setMethod(method: string | null): void {
    this._method = method;
  }

  /** @internal */
  public _setUrl(url: string | null): void {
    this._url = url;
  }

  /** @internal */
  public _setHttpVersion(version: string): void {
    this._httpVersion = version;
  }

  /** @internal */
  public _setStatusCode(code: int | null): void {
    this._statusCode = code;
  }

  /** @internal */
  public _setStatusMessage(message: string | null): void {
    this._statusMessage = message;
  }

  /** @internal */
  public _setHeaders(headers: Map<string, string>): void {
    this._headers = headers;
  }

  /** @internal */
  public _markComplete(): void {
    this._complete = true;
  }

  /**
   * Emits buffered client body data/end/close events.
   * @internal
   */
  public _emitBufferedClientBody(body: string): void {
    if (body.length > 0) {
      this.emit("data", body);
    }
    this._complete = true;
    this.emit("end");
    this.emit("close");
  }
}
