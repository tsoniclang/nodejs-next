/**
 * Base class for all streams. A stream is an abstract interface for working
 * with streaming data.
 *
 * Baseline: nodejs-clr/src/nodejs/stream/Stream.cs
 */
import { EventEmitter } from "../events-module.ts";

import type { Readable } from "./readable.ts";
import type { Writable } from "./writable.ts";
import type { Duplex } from "./duplex.ts";

export class Stream extends EventEmitter {
  /**
   * Pipes the output of this readable stream into a writable stream
   * destination.
   *
   * @param destination - The destination writable stream.
   * @param options - Pipe options.
   * @param options.end - Whether to end the destination when this stream ends.
   *   Default is true.
   * @returns The destination stream.
   */
  public pipe<T extends Stream>(
    destination: T,
    options?: { readonly end?: boolean },
  ): T {
    const self = this as unknown as Readable;
    const end = options?.end !== false;

    self.on("data", (chunk: unknown) => {
      (destination as unknown as Writable).write(chunk);
    });

    if (end) {
      self.on("end", () => {
        (destination as unknown as Writable).end();
      });
    }

    self.on("error", (err: unknown) => {
      destination.emit("error", err);
    });

    self.resume();

    return destination;
  }

  /**
   * Destroys the stream and optionally emits an error event.
   *
   * @param error - Optional error to emit.
   */
  public destroy(error?: Error): void {
    if (error !== undefined) {
      this.emit("error", error);
    }

    this.emit("close");
  }
}
