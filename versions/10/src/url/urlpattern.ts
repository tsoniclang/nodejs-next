/**
 * URLPattern — minimal URL pattern matching.
 *
 * Baseline: nodejs-clr/src/nodejs/url/URLPattern.cs
 */

export class URLPattern {
  private readonly regex: RegExp;

  constructor(pattern: string) {
    // Escape regex special characters, then convert * to .*
    const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const withWildcards = escaped.replace(/\\\*/g, ".*");
    this.regex = new RegExp("^" + withWildcards + "$");
  }

  test(input: string): boolean {
    return this.regex.test(input);
  }

  exec(input: string): Record<string, string> | null {
    if (!this.test(input)) {
      return null;
    }
    return { input };
  }
}
