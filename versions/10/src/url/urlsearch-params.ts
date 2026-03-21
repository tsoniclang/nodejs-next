/**
 * URLSearchParams — read/write access to the query of a URL.
 *
 * Baseline: nodejs-clr/src/nodejs/url/URLSearchParams.cs
 */

export class URLSearchParams {
  private readonly params: Array<[string, string]> = [];

  get size(): number {
    return this.params.length;
  }

  constructor(init?: string) {
    if (init !== undefined && init !== null && init.length > 0) {
      this.parseQueryString(init);
    }
  }

  append(name: string, value: string): void {
    this.params.push([name, value]);
  }

  set(name: string, value: string): void {
    // Remove all existing entries with this name
    for (let i = this.params.length - 1; i >= 0; i -= 1) {
      if (this.params[i]![0] === name) {
        this.params.splice(i, 1);
      }
    }
    this.params.push([name, value]);
  }

  get(name: string): string | null {
    for (let i = 0; i < this.params.length; i += 1) {
      if (this.params[i]![0] === name) {
        return this.params[i]![1];
      }
    }
    return null;
  }

  getAll(name: string): string[] {
    const result: string[] = [];
    for (let i = 0; i < this.params.length; i += 1) {
      if (this.params[i]![0] === name) {
        result.push(this.params[i]![1]);
      }
    }
    return result;
  }

  has(name: string, value?: string): boolean {
    for (let i = 0; i < this.params.length; i += 1) {
      if (this.params[i]![0] === name) {
        if (value === undefined || this.params[i]![1] === value) {
          return true;
        }
      }
    }
    return false;
  }

  delete(name: string, value?: string): void {
    for (let i = this.params.length - 1; i >= 0; i -= 1) {
      if (this.params[i]![0] === name) {
        if (value === undefined || this.params[i]![1] === value) {
          this.params.splice(i, 1);
        }
      }
    }
  }

  sort(): void {
    this.params.sort((a, b) => {
      if (a[0] < b[0]) return -1;
      if (a[0] > b[0]) return 1;
      return 0;
    });
  }

  keys(): string[] {
    return this.params.map((p) => p[0]);
  }

  values(): string[] {
    return this.params.map((p) => p[1]);
  }

  entries(): Array<[string, string]> {
    return [...this.params];
  }

  forEach(callback: (value: string, name: string) => void): void {
    for (let i = 0; i < this.params.length; i += 1) {
      callback(this.params[i]![1], this.params[i]![0]);
    }
  }

  toString(): string {
    if (this.params.length === 0) {
      return "";
    }
    const parts: string[] = [];
    for (let i = 0; i < this.params.length; i += 1) {
      parts.push(
        encodeURIComponent(this.params[i]![0]) +
          "=" +
          encodeURIComponent(this.params[i]![1])
      );
    }
    return parts.join("&");
  }

  private parseQueryString(query: string): void {
    let input = query;
    if (input.startsWith("?")) {
      input = input.slice(1);
    }
    if (input.length === 0) {
      return;
    }
    const pairs = input.split("&");
    for (let i = 0; i < pairs.length; i += 1) {
      const pair = pairs[i]!;
      const eqIndex = pair.indexOf("=");
      if (eqIndex >= 0) {
        const key = decodeURIComponent(pair.slice(0, eqIndex));
        const value = decodeURIComponent(pair.slice(eqIndex + 1));
        this.params.push([key, value]);
      } else {
        this.params.push([decodeURIComponent(pair), ""]);
      }
    }
  }
}
