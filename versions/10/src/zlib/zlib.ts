/**
 * Node.js zlib module — compression functionality using Gzip, Deflate, and Brotli.
 *
 * Baseline: nodejs-clr/src/nodejs/zlib/zlib.cs
 *
 * NOTE: The CLR baseline uses System.IO.Compression (GZipStream, DeflateStream,
 * BrotliStream). The native implementation delegates to the platform's native
 * zlib / brotli via CompressionStream/DecompressionStream where available,
 * with TODO placeholders for sync variants that require native bindings.
 */
import type { BrotliOptions } from "./brotli-options.ts";
import type { ZlibOptions } from "./zlib-options.ts";
import type { int } from "@tsonic/core/types.js";
import { stringToBytes } from "../buffer/buffer-encoding.ts";

// ---------------------------------------------------------------------------
// CRC-32 table (computed once, standard IEEE polynomial 0xEDB88320)
// ---------------------------------------------------------------------------

const buildCrc32Table = (): Map<string, int> => {
  const table = new Map<string, int>();
  const polynomial: int = -306674912;
  for (let i: int = 0; i < 256; i += 1) {
    let crc: int = i;
    for (let j: int = 0; j < 8; j += 1) {
      crc = (crc & 1) === 1 ? (crc >>> 1) ^ polynomial : crc >>> 1;
    }
    table.set(String(i), crc >>> 0);
  }
  return table;
};

const CRC32_TABLE: Map<string, int> = buildCrc32Table();

// ---------------------------------------------------------------------------
// crc32
// ---------------------------------------------------------------------------

/**
 * Calculate CRC32 checksum for a Uint8Array.
 *
 * @param data  The data to checksum.
 * @param value Optional initial CRC value (for incremental computation).
 * @returns The CRC32 checksum as an unsigned 32-bit integer.
 */
export const crc32 = (data: Uint8Array, value: int = 0): int => {
  if (data === null || data === undefined) {
    throw new Error("data must not be null");
  }

  const initialCrc: int = value === 0 ? -1 : ~value;
  const result = computeCrc32(data, initialCrc >>> 0);
  return result >>> 0;
};

/**
 * Calculate CRC32 checksum for a string (UTF-8 encoded).
 *
 * @param data  The string to checksum.
 * @param value Optional initial CRC value.
 * @returns The CRC32 checksum as an unsigned 32-bit integer.
 */
export const crc32String = (data: string, value: int = 0): int => {
  if (data === null || data === undefined) {
    throw new Error("data must not be null");
  }

  const bytes = stringToBytes(data, "utf8");
  return crc32(bytes, value);
};

const computeCrc32 = (data: Uint8Array, crc: int): int => {
  let current: int = crc;
  for (let i: int = 0; i < data.length; i += 1) {
    const tableIndex = String((current ^ data[i]!) & 0xff);
    const tableValue: int = CRC32_TABLE.get(tableIndex) ?? 0;
    current = (current >>> 8) ^ tableValue;
  }
  return ~current;
};

// ---------------------------------------------------------------------------
// Gzip
// ---------------------------------------------------------------------------

/**
 * Compress data using Gzip.
 *
 * @param buffer  The data to compress.
 * @param options Optional compression options.
 * @returns The compressed data.
 */
export const gzipSync = (
  buffer: Uint8Array,
  _options?: ZlibOptions,
): Uint8Array => {
  if (buffer === null || buffer === undefined) {
    throw new Error("buffer must not be null");
  }

  // TODO: Implement native gzip compression.
  // The CLR baseline uses System.IO.Compression.GZipStream.
  // Native implementation should use platform zlib bindings or
  // CompressionStream('gzip') in async form.
  throw new Error("gzipSync: not yet implemented (requires native zlib)");
};

/**
 * Decompress Gzip data.
 *
 * @param buffer  The compressed data.
 * @param options Optional decompression options.
 * @returns The decompressed data.
 */
export const gunzipSync = (
  buffer: Uint8Array,
  _options?: ZlibOptions,
): Uint8Array => {
  if (buffer === null || buffer === undefined) {
    throw new Error("buffer must not be null");
  }

  // TODO: Implement native gzip decompression.
  // The CLR baseline uses System.IO.Compression.GZipStream in Decompress mode.
  throw new Error("gunzipSync: not yet implemented (requires native zlib)");
};

// ---------------------------------------------------------------------------
// Deflate
// ---------------------------------------------------------------------------

/**
 * Compress data using Deflate.
 *
 * @param buffer  The data to compress.
 * @param options Optional compression options.
 * @returns The compressed data.
 */
export const deflateSync = (
  buffer: Uint8Array,
  _options?: ZlibOptions,
): Uint8Array => {
  if (buffer === null || buffer === undefined) {
    throw new Error("buffer must not be null");
  }

  // TODO: Implement native deflate compression.
  // The CLR baseline uses System.IO.Compression.DeflateStream.
  throw new Error("deflateSync: not yet implemented (requires native zlib)");
};

/**
 * Decompress Deflate data.
 *
 * @param buffer  The compressed data.
 * @param options Optional decompression options.
 * @returns The decompressed data.
 */
export const inflateSync = (
  buffer: Uint8Array,
  _options?: ZlibOptions,
): Uint8Array => {
  if (buffer === null || buffer === undefined) {
    throw new Error("buffer must not be null");
  }

  // TODO: Implement native deflate decompression.
  // The CLR baseline uses System.IO.Compression.DeflateStream in Decompress mode.
  throw new Error("inflateSync: not yet implemented (requires native zlib)");
};

/**
 * Compress data using raw Deflate (no zlib wrapper headers).
 *
 * @param buffer  The data to compress.
 * @param options Optional compression options.
 * @returns The compressed data.
 */
export const deflateRawSync = (
  buffer: Uint8Array,
  options?: ZlibOptions,
): Uint8Array => {
  // .NET's DeflateStream is already "raw" deflate (no zlib wrapper).
  // Same applies to the native implementation.
  return deflateSync(buffer, options);
};

/**
 * Decompress raw Deflate data (without zlib wrapper headers).
 *
 * @param buffer  The compressed data.
 * @param options Optional decompression options.
 * @returns The decompressed data.
 */
export const inflateRawSync = (
  buffer: Uint8Array,
  options?: ZlibOptions,
): Uint8Array => {
  // .NET's DeflateStream is already "raw" deflate (no zlib wrapper).
  return inflateSync(buffer, options);
};

// ---------------------------------------------------------------------------
// Brotli
// ---------------------------------------------------------------------------

/**
 * Compress data using Brotli.
 *
 * @param buffer  The data to compress.
 * @param options Optional compression options.
 * @returns The compressed data.
 */
export const brotliCompressSync = (
  buffer: Uint8Array,
  _options?: BrotliOptions,
): Uint8Array => {
  if (buffer === null || buffer === undefined) {
    throw new Error("buffer must not be null");
  }

  // TODO: Implement native Brotli compression.
  // The CLR baseline uses System.IO.Compression.BrotliStream.
  throw new Error(
    "brotliCompressSync: not yet implemented (requires native brotli)",
  );
};

/**
 * Decompress Brotli data.
 *
 * @param buffer  The compressed data.
 * @param options Optional decompression options.
 * @returns The decompressed data.
 */
export const brotliDecompressSync = (
  buffer: Uint8Array,
  _options?: BrotliOptions,
): Uint8Array => {
  if (buffer === null || buffer === undefined) {
    throw new Error("buffer must not be null");
  }

  // TODO: Implement native Brotli decompression.
  // The CLR baseline uses System.IO.Compression.BrotliStream in Decompress mode.
  throw new Error(
    "brotliDecompressSync: not yet implemented (requires native brotli)",
  );
};

// ---------------------------------------------------------------------------
// unzipSync — auto-detect format
// ---------------------------------------------------------------------------

/**
 * Decompress data. Auto-detects Gzip or Deflate format by magic bytes.
 *
 * @param buffer  The compressed data.
 * @param options Optional decompression options.
 * @returns The decompressed data.
 */
export const unzipSync = (
  buffer: Uint8Array,
  options?: ZlibOptions,
): Uint8Array => {
  if (buffer === null || buffer === undefined) {
    throw new Error("buffer must not be null");
  }

  if (buffer.length < 2) {
    throw new Error("Buffer too small to determine compression format");
  }

  // Detect format by magic bytes
  // Gzip: 0x1f 0x8b
  if (buffer[0] === 0x1f && buffer[1] === 0x8b) {
    return gunzipSync(buffer, options);
  }

  // Zlib format (deflate with header): 0x78 (multiple variations)
  if (buffer[0] === 0x78) {
    // Skip the 2-byte zlib header and use raw deflate
    const deflateData = buffer.slice(2);
    return inflateSync(deflateData, options);
  }

  // Try raw deflate
  return inflateSync(buffer, options);
};
