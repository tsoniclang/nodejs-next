/**
 * Buffer encoding helpers -- normalizing encoding names and converting
 * between byte arrays and encoded string forms (hex, base64, base64url).
 *
 * Baseline: nodejs-clr/src/nodejs/buffer/Buffer.encoding.cs
 */

export type BufferEncoding =
  | "utf8"
  | "utf-8"
  | "ascii"
  | "latin1"
  | "binary"
  | "utf16le"
  | "utf-16le"
  | "ucs2"
  | "ucs-2"
  | "base64"
  | "base64url"
  | "hex";

/**
 * Normalizes encoding name to a canonical lowercase form with no hyphens/underscores.
 */
export const normalizeEncoding = (encoding: string): string => {
  return encoding.toLowerCase().replace(/-/g, "").replace(/_/g, "");
};

/**
 * Encodes a string to bytes using the specified encoding.
 * For standard text encodings this uses TextEncoder / manual loops;
 * for hex and base64 it decodes the *string* as that format into raw bytes.
 */
export const stringToBytes = (
  str: string,
  encoding: string,
): Uint8Array => {
  const norm = normalizeEncoding(encoding);

  switch (norm) {
    case "utf8":
      return new TextEncoder().encode(str);

    case "ascii": {
      const out = new Uint8Array(str.length);
      for (let i = 0; i < str.length; i += 1) {
        out[i] = str.charCodeAt(i) & 0x7f;
      }
      return out;
    }

    case "latin1":
    case "binary": {
      const out = new Uint8Array(str.length);
      for (let i = 0; i < str.length; i += 1) {
        out[i] = str.charCodeAt(i) & 0xff;
      }
      return out;
    }

    case "utf16le":
    case "ucs2": {
      const out = new Uint8Array(str.length * 2);
      for (let i = 0; i < str.length; i += 1) {
        const code = str.charCodeAt(i);
        out[i * 2] = code & 0xff;
        out[i * 2 + 1] = (code >> 8) & 0xff;
      }
      return out;
    }

    case "hex":
      return hexToBytes(str);

    case "base64":
      return base64ToBytes(str);

    case "base64url":
      return base64ToBytes(base64UrlToBase64(str));

    default:
      // Fall back to utf-8
      return new TextEncoder().encode(str);
  }
};

/**
 * Decodes a byte range to a string using the specified encoding.
 */
export const bytesToString = (
  bytes: Uint8Array,
  encoding: string,
  start: number,
  end: number,
): string => {
  const norm = normalizeEncoding(encoding);
  const slice = bytes.subarray(start, end);

  switch (norm) {
    case "utf8":
      return new TextDecoder("utf-8", { fatal: false }).decode(slice);

    case "ascii": {
      let result = "";
      for (let i = 0; i < slice.length; i += 1) {
        result += String.fromCharCode(slice[i]! & 0x7f);
      }
      return result;
    }

    case "latin1":
    case "binary": {
      let result = "";
      for (let i = 0; i < slice.length; i += 1) {
        result += String.fromCharCode(slice[i]!);
      }
      return result;
    }

    case "utf16le":
    case "ucs2": {
      let result = "";
      for (let i = 0; i + 1 < slice.length; i += 2) {
        result += String.fromCharCode(slice[i]! | (slice[i + 1]! << 8));
      }
      return result;
    }

    case "hex":
      return bytesToHex(slice, 0, slice.length);

    case "base64":
      return bytesToBase64(slice);

    case "base64url":
      return base64ToBase64Url(bytesToBase64(slice));

    default:
      return new TextDecoder("utf-8", { fatal: false }).decode(slice);
  }
};

/**
 * Returns the byte count that a string would take under the given encoding.
 */
export const byteLengthOfString = (
  str: string,
  encoding: string,
): number => {
  const norm = normalizeEncoding(encoding);

  switch (norm) {
    case "utf8":
      return new TextEncoder().encode(str).length;

    case "ascii":
    case "latin1":
    case "binary":
      return str.length;

    case "utf16le":
    case "ucs2":
      return str.length * 2;

    case "hex":
      return Math.floor(str.length / 2);

    case "base64":
    case "base64url": {
      // Base64 encodes 3 bytes per 4 chars; strip padding for size calculation
      let stripped = str;
      if (norm === "base64url") {
        stripped = base64UrlToBase64(stripped);
      }
      const pad = stripped.endsWith("==") ? 2 : stripped.endsWith("=") ? 1 : 0;
      return Math.floor((stripped.length * 3) / 4) - pad;
    }

    default:
      return new TextEncoder().encode(str).length;
  }
};

// ---- hex helpers ----

export const hexToBytes = (hex: string): Uint8Array => {
  const cleaned = hex.replace(/\s/g, "");
  const bytes = new Uint8Array(Math.floor(cleaned.length / 2));
  for (let i = 0; i < bytes.length; i += 1) {
    bytes[i] = parseInt(cleaned.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
};

export const bytesToHex = (
  bytes: Uint8Array,
  start: number,
  end: number,
): string => {
  let hex = "";
  for (let i = start; i < end; i += 1) {
    hex += (bytes[i]! < 16 ? "0" : "") + bytes[i]!.toString(16);
  }
  return hex;
};

// ---- base64 helpers ----

const BASE64_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

export const bytesToBase64 = (bytes: Uint8Array): string => {
  let result = "";
  for (let i = 0; i < bytes.length; i += 3) {
    const b0 = bytes[i]!;
    const b1 = i + 1 < bytes.length ? bytes[i + 1]! : 0;
    const b2 = i + 2 < bytes.length ? bytes[i + 2]! : 0;

    result += BASE64_CHARS[(b0 >> 2) & 0x3f];
    result += BASE64_CHARS[((b0 << 4) | (b1 >> 4)) & 0x3f];
    result += i + 1 < bytes.length ? BASE64_CHARS[((b1 << 2) | (b2 >> 6)) & 0x3f] : "=";
    result += i + 2 < bytes.length ? BASE64_CHARS[b2 & 0x3f] : "=";
  }
  return result;
};

const BASE64_LOOKUP: Record<string, number> = {};
for (let i = 0; i < BASE64_CHARS.length; i += 1) {
  BASE64_LOOKUP[BASE64_CHARS[i]!] = i;
}

export const base64ToBytes = (base64: string): Uint8Array => {
  // Strip padding
  const stripped = base64.replace(/=+$/, "");
  const byteLength = Math.floor((stripped.length * 3) / 4);
  const bytes = new Uint8Array(byteLength);
  let offset = 0;

  for (let i = 0; i < stripped.length; i += 4) {
    const a = BASE64_LOOKUP[stripped[i]!] ?? 0;
    const b = BASE64_LOOKUP[stripped[i + 1]!] ?? 0;
    const c = BASE64_LOOKUP[stripped[i + 2]!] ?? 0;
    const d = BASE64_LOOKUP[stripped[i + 3]!] ?? 0;

    bytes[offset] = ((a << 2) | (b >> 4)) & 0xff;
    offset += 1;
    if (offset < byteLength) {
      bytes[offset] = ((b << 4) | (c >> 2)) & 0xff;
      offset += 1;
    }
    if (offset < byteLength) {
      bytes[offset] = ((c << 6) | d) & 0xff;
      offset += 1;
    }
  }

  return bytes;
};

export const base64UrlToBase64 = (base64url: string): string => {
  let base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  const padding = (4 - (base64.length % 4)) % 4;
  if (padding > 0) {
    base64 = base64 + "=".repeat(padding);
  }
  return base64;
};

export const base64ToBase64Url = (base64: string): string => {
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};
