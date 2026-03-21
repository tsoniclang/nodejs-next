/**
 * Node.js perf_hooks module — performance measurement APIs.
 *
 * Baseline: nodejs-clr/src/nodejs/perf_hooks/
 */

export {
  PerformanceEntry,
  PerformanceMark,
  PerformanceMeasure,
} from "./performance-entry.ts";

export {
  PerformanceObserver,
  PerformanceObserverEntryList,
} from "./performance-observer.ts";

export type {
  PerformanceObserverOptions,
  PerformanceObserverCallback,
} from "./performance-observer.ts";

export {
  now,
  mark,
  measure,
  getEntries,
  getEntriesByName,
  getEntriesByType,
  clearMarks,
  clearMeasures,
} from "./performance.ts";

export type { MarkOptions, MeasureOptions } from "./performance.ts";

import * as performanceModule from "./performance.ts";
import type { MarkOptions, MeasureOptions } from "./performance.ts";
import type {
  PerformanceEntry,
  PerformanceMark,
  PerformanceMeasure,
} from "./performance-entry.ts";

type PerformanceApi = {
  now: () => number;
  mark: (name: string, options?: MarkOptions | null) => PerformanceMark;
  measure: (
    name: string,
    startOrOptions?: string | MeasureOptions | null,
    endMark?: string | null,
  ) => PerformanceMeasure;
  getEntries: () => PerformanceEntry[];
  getEntriesByName: (
    name: string,
    type?: string | null,
  ) => PerformanceEntry[];
  getEntriesByType: (type: string) => PerformanceEntry[];
  clearMarks: (name?: string | null) => void;
  clearMeasures: (name?: string | null) => void;
};

/**
 * The performance object — a namespace-like re-export of the performance functions
 * matching Node.js `perf_hooks.performance`.
 */
export const performance: PerformanceApi = {
  now: performanceModule.now,
  mark: performanceModule.mark,
  measure: performanceModule.measure,
  getEntries: performanceModule.getEntries,
  getEntriesByName: performanceModule.getEntriesByName,
  getEntriesByType: performanceModule.getEntriesByType,
  clearMarks: performanceModule.clearMarks,
  clearMeasures: performanceModule.clearMeasures,
};
