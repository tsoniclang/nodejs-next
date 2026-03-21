/**
 * Utility functions for working with streams.
 *
 * Baseline: nodejs-clr/src/nodejs/stream/utilities.cs
 */
import { Stream } from "./stream.ts";

/**
 * A method to pipe between streams forwarding errors and properly cleaning up.
 *
 * The last argument may be a callback of the form (error: Error | undefined) => void.
 * All other arguments must be Stream instances. At least two streams are required.
 */
export const pipeline = (...args: unknown[]): void => {
  if (args.length < 2) {
    throw new Error(
      "pipeline requires at least a source and destination",
    );
  }

  // Check if last argument is a callback
  let callback: ((error: Error | undefined) => void) | undefined;
  const streamList: Stream[] = [];

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (i === args.length - 1 && typeof arg === "function") {
      callback = arg as (error: Error | undefined) => void;
    } else if (arg instanceof Stream) {
      streamList.push(arg);
    } else {
      throw new Error(`Argument ${String(i)} is not a Stream or callback`);
    }
  }

  if (streamList.length < 2) {
    throw new Error(
      "pipeline requires at least a source and destination stream",
    );
  }

  try {
    // Pipe streams together
    for (let i = 0; i < streamList.length - 1; i += 1) {
      const source = streamList[i]!;
      const dest = streamList[i + 1]!;

      // Set up error handling
      source.on("error", (err: unknown) => {
        // Destroy remaining streams
        for (let j = i; j < streamList.length; j += 1) {
          streamList[j]!.destroy(
            err instanceof Error ? err : new Error(String(err)),
          );
        }
        if (callback !== undefined) {
          callback(err instanceof Error ? err : new Error(String(err)));
        }
      });

      // Pipe source to destination
      source.pipe(dest, {
        end: i === streamList.length - 2,
      });
    }

    // Handle final stream completion
    const lastStream = streamList[streamList.length - 1]!;
    lastStream.on("finish", () => {
      if (callback !== undefined) {
        callback(undefined);
      }
    });
    lastStream.on("end", () => {
      if (callback !== undefined) {
        callback(undefined);
      }
    });
    lastStream.on("error", (err: unknown) => {
      if (callback !== undefined) {
        callback(err instanceof Error ? err : new Error(String(err)));
      }
    });
  } catch (ex: unknown) {
    // Clean up all streams on error
    const error = ex instanceof Error ? ex : new Error(String(ex));
    for (const s of streamList) {
      try {
        s.destroy(error);
      } catch {
        // Ignore cleanup errors
      }
    }
    if (callback !== undefined) {
      callback(error);
    }
  }
};

/**
 * A function to get notified when a stream is no longer readable, writable or
 * has experienced an error or a premature close event.
 *
 * @param stream - The stream to monitor.
 * @param callback - The callback to invoke when the stream is finished.
 */
export const finished = (
  stream: Stream,
  callback: (error: Error | undefined) => void,
): void => {
  let called = false;

  const onFinished = (error: Error | undefined): void => {
    if (called) {
      return;
    }
    called = true;

    stream.removeListener("finish", onFinish);
    stream.removeListener("end", onEnd);
    stream.removeListener("error", onError);
    stream.removeListener("close", onClose);

    callback(error);
  };

  const onFinish = (): void => {
    onFinished(undefined);
  };
  const onEnd = (): void => {
    onFinished(undefined);
  };
  const onError = (err: unknown): void => {
    onFinished(err instanceof Error ? err : new Error(String(err)));
  };
  const onClose = (hadError?: boolean): void => {
    onFinished(
      hadError === true
        ? new Error("Stream closed with error")
        : undefined,
    );
  };

  stream.on("finish", onFinish);
  stream.on("end", onEnd);
  stream.on("error", onError);
  stream.on("close", onClose);
};
