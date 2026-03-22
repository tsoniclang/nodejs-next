/**
 * PerformanceObserver — observes performance measurement events and notifies
 * when new performance entries are added to the performance timeline.
 *
 * Baseline: nodejs-clr/src/nodejs/perf_hooks/PerformanceObserver.cs
 */

import { PerformanceEntry } from "./performance-entry.ts";

/**
 * Options for configuring a PerformanceObserver.
 */
export interface PerformanceObserverOptions {
  readonly entryTypes: readonly string[];
  readonly buffered?: boolean;
}

/**
 * A list of performance entries provided to PerformanceObserver callbacks.
 */
export class PerformanceObserverEntryList {
  private readonly entries: readonly PerformanceEntry[];

  public constructor(entries: readonly PerformanceEntry[]) {
    this.entries = entries;
  }

  public getEntries(): PerformanceEntry[] {
    return [...this.entries];
  }

  public getEntriesByName(
    name: string,
    type?: string | null,
  ): PerformanceEntry[] {
    if (name === null || name === undefined || name.length === 0) {
      throw new Error("Name cannot be null or empty");
    }

    const filtered = this.entries.filter((entry) => {
      if (entry.name !== name) {
        return false;
      }
      if (
        type !== null &&
        type !== undefined &&
        type.length > 0 &&
        entry.entryType !== type
      ) {
        return false;
      }
      return true;
    });

    return filtered;
  }

  public getEntriesByType(type: string): PerformanceEntry[] {
    if (type === null || type === undefined || type.length === 0) {
      throw new Error("Type cannot be null or empty");
    }

    return this.entries.filter((entry) => entry.entryType === type);
  }
}

export type PerformanceObserverCallback = (
  list: PerformanceObserverEntryList,
  observer: PerformanceObserver,
) => void;

const observers: PerformanceObserver[] = [];

/**
 * PerformanceObserver is used to observe performance measurement events and be notified
 * when new performance entries are added to the performance timeline.
 */
export class PerformanceObserver {
  private readonly callback: PerformanceObserverCallback;
  private entryTypes: string[] = [];
  private observing = false;

  public constructor(callback: PerformanceObserverCallback) {
    if (callback === null || callback === undefined) {
      throw new Error("callback must not be null");
    }
    this.callback = callback;
  }

  public observe(options: PerformanceObserverOptions): void {
    if (options === null || options === undefined) {
      throw new Error("options must not be null");
    }

    if (
      options.entryTypes === null ||
      options.entryTypes === undefined ||
      options.entryTypes.length === 0
    ) {
      throw new Error("entryTypes must be provided and non-empty");
    }

    this.entryTypes = [...options.entryTypes];
    this.observing = true;

    if (!observers.includes(this)) {
      observers.push(this);
    }
  }

  public disconnect(): void {
    this.observing = false;

    const index = observers.indexOf(this);
    if (index >= 0) {
      observers.splice(index, 1);
    }
  }

  public takeRecords(): PerformanceObserverEntryList {
    return new PerformanceObserverEntryList([]);
  }

  public static supportedEntryTypes(): string[] {
    return ["mark", "measure", "function", "gc", "resource"];
  }

  /** @internal */
  static notifyObservers(entry: PerformanceEntry): void {
    const toNotify = observers.filter(
      (observer) =>
        observer.observing && observer.entryTypes.includes(entry.entryType),
    );

    for (const observer of toNotify) {
      try {
        const entryList = new PerformanceObserverEntryList([entry]);
        observer.callback(entryList, observer);
      } catch {
        // Observers should not throw, but if they do, we continue notifying others
      }
    }
  }
}
