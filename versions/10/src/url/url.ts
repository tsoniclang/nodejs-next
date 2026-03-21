/**
 * URL class — parsed URL with properties for accessing and modifying URL components.
 *
 * Baseline: nodejs-clr/src/nodejs/url/URL.cs
 *
 * NOTE: This implementation wraps the global URL constructor which is available
 * in modern JS runtimes. The CLR baseline wraps System.Uri. The native version
 * preserves the same public surface shape.
 */

import { URLSearchParams } from "./urlsearch-params.ts";

const isDefaultPort = (scheme: string, port: string): boolean => {
  if (scheme === "http:" && port === "80") return true;
  if (scheme === "https:" && port === "443") return true;
  if (scheme === "ftp:" && port === "21") return true;
  return false;
};

export class URL {
  private url: globalThis.URL;
  private cachedSearchParams: URLSearchParams | null = null;

  constructor(input: string, base?: string) {
    this.url = base !== undefined ? new globalThis.URL(input, base) : new globalThis.URL(input);
  }

  get href(): string {
    return this.url.href;
  }

  set href(value: string) {
    this.url = new globalThis.URL(value);
    this.cachedSearchParams = null;
  }

  get protocol(): string {
    return this.url.protocol;
  }

  set protocol(value: string) {
    this.url.protocol = value;
  }

  get username(): string {
    return this.url.username;
  }

  set username(value: string) {
    this.url.username = value;
  }

  get password(): string {
    return this.url.password;
  }

  set password(value: string) {
    this.url.password = value;
  }

  get host(): string {
    return this.url.host;
  }

  set host(value: string) {
    this.url.host = value;
  }

  get hostname(): string {
    return this.url.hostname;
  }

  set hostname(value: string) {
    this.url.hostname = value;
  }

  get port(): string {
    return this.url.port;
  }

  set port(value: string) {
    this.url.port = value;
  }

  get pathname(): string {
    return this.url.pathname;
  }

  set pathname(value: string) {
    this.url.pathname = value;
  }

  get search(): string {
    return this.url.search;
  }

  set search(value: string) {
    this.url.search = value;
    this.cachedSearchParams = null;
  }

  get searchParams(): URLSearchParams {
    if (this.cachedSearchParams === null) {
      this.cachedSearchParams = new URLSearchParams(this.url.search);
    }
    return this.cachedSearchParams;
  }

  get hash(): string {
    return this.url.hash;
  }

  set hash(value: string) {
    this.url.hash = value;
  }

  get origin(): string {
    return this.url.origin;
  }

  toString(): string {
    return this.href;
  }

  toJSON(): string {
    return this.href;
  }

  static canParse(input: string, base?: string): boolean {
    try {
      if (base !== undefined) {
        void new globalThis.URL(input, base);
      } else {
        void new globalThis.URL(input);
      }
      return true;
    } catch {
      return false;
    }
  }

  static parse(input: string, base?: string): URL | null {
    try {
      return new URL(input, base);
    } catch {
      return null;
    }
  }
}
