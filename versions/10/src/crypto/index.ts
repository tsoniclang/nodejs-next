/**
 * Node.js crypto module.
 *
 * Baseline: nodejs-clr/src/nodejs/crypto/crypto.cs
 */
import type { int } from "@tsonic/core/types.js";

import { Hash } from "./hash.ts";
import { Hmac } from "./hmac.ts";
import { Cipher } from "./cipher.ts";
import { Decipher } from "./decipher.ts";
import { DiffieHellman } from "./diffie-hellman.ts";
import { ECDH } from "./ecdh.ts";
import { Sign } from "./sign.ts";
import { Verify } from "./verify.ts";
import { Certificate, X509CertificateInfo } from "./certificate.ts";
import {
  KeyObject,
  SecretKeyObject,
  PublicKeyObject,
  PrivateKeyObject,
} from "./key-object.ts";
import { DSAPublicKeyObject, DSAPrivateKeyObject } from "./dsakey-object.ts";
import { EdDSAPublicKeyObject, EdDSAPrivateKeyObject } from "./ed-dsakey-object.ts";
import { getGroup, isValidGroup } from "./modpgroups.ts";

const createDiffieHellmanFromLength = (
  primeLength: number,
  generatorNumber: number
): DiffieHellman => {
  return new DiffieHellman(primeLength, generatorNumber);
};

const createDiffieHellmanFromBytes = (
  primeBytes: Uint8Array,
  generatorBytes: Uint8Array
): DiffieHellman => {
  return new DiffieHellman(primeBytes, generatorBytes);
};

// ── Hash ───────────────────────────────────────────────────────────────────

/**
 * Creates and returns a Hash object that can be used to generate hash digests.
 */
export const createHash = (algorithm: string): Hash => {
  return new Hash(algorithm);
};

// ── Hmac ───────────────────────────────────────────────────────────────────

/**
 * Creates and returns an Hmac object that uses the given algorithm and key.
 */
export const createHmac = (
  algorithm: string,
  key: string | Uint8Array
): Hmac => {
  if (typeof key === "string") {
    // TODO: encode string key to Uint8Array
    return new Hmac(algorithm, new Uint8Array(0));
  }

  return new Hmac(algorithm, key);
};

// ── Cipher / Decipher ──────────────────────────────────────────────────────

/**
 * Creates and returns a Cipher object with the given algorithm, key, and initialization vector.
 */
export const createCipheriv = (
  algorithm: string,
  key: string | Uint8Array,
  iv: string | Uint8Array | null
): Cipher => {
  const keyBytes = typeof key === "string" ? new Uint8Array(0) : key; // TODO: encode
  const ivBytes =
    iv === null ? null : typeof iv === "string" ? new Uint8Array(0) : iv; // TODO: encode
  return new Cipher(algorithm, keyBytes, ivBytes);
};

/**
 * Creates and returns a Decipher object with the given algorithm, key, and initialization vector.
 */
export const createDecipheriv = (
  algorithm: string,
  key: string | Uint8Array,
  iv: string | Uint8Array | null
): Decipher => {
  const keyBytes = typeof key === "string" ? new Uint8Array(0) : key; // TODO: encode
  const ivBytes =
    iv === null ? null : typeof iv === "string" ? new Uint8Array(0) : iv; // TODO: encode
  return new Decipher(algorithm, keyBytes, ivBytes);
};

// ── Random ─────────────────────────────────────────────────────────────────

/**
 * Generates cryptographically strong pseudo-random data.
 */
export const randomBytes = (size: int): Uint8Array => {
  // TODO: actual CSPRNG implementation
  return new Uint8Array(size);
};

/**
 * Generates cryptographically strong pseudo-random data asynchronously.
 */
export const randomBytesAsync = (
  size: int,
  callback: (err: Error | null, buf: Uint8Array | null) => void
): void => {
  try {
    const bytes = randomBytes(size);
    callback(null, bytes);
  } catch (e) {
    callback(e instanceof Error ? e : new Error(String(e)), null);
  }
};

/**
 * Generates a random integer.
 */
export const randomInt = (minOrMax: int, max?: int): int => {
  if (max === undefined) {
    // TODO: actual random int in range [0, minOrMax)
    return 0 as int;
  }

  // TODO: actual random int in range [minOrMax, max)
  void minOrMax;
  return 0 as int;
};

/**
 * Fills a buffer with random bytes.
 */
export const randomFillSync = (
  buffer: Uint8Array,
  offset?: int,
  size?: int
): Uint8Array => {
  // TODO: actual random fill
  void offset;
  void size;
  return buffer;
};

/**
 * Fills a buffer with random bytes asynchronously.
 */
export const randomFill = (
  buffer: Uint8Array,
  offset: int,
  size: int,
  callback: (err: Error | null, buf: Uint8Array | null) => void
): void => {
  try {
    randomFillSync(buffer, offset, size);
    callback(null, buffer);
  } catch (e) {
    callback(e instanceof Error ? e : new Error(String(e)), null);
  }
};

/**
 * Generates a UUID v4.
 */
export const randomUUID = (): string => {
  // TODO: actual UUID v4 generation
  return "00000000-0000-4000-8000-000000000000";
};

// ── Key derivation ─────────────────────────────────────────────────────────

/**
 * Provides a synchronous Password-Based Key Derivation Function 2 (PBKDF2) implementation.
 */
export const pbkdf2Sync = (
  password: string | Uint8Array,
  salt: string | Uint8Array,
  iterations: int,
  keylen: int,
  digest: string
): Uint8Array => {
  // TODO: actual PBKDF2 implementation
  void password;
  void salt;
  void iterations;
  void digest;
  return new Uint8Array(keylen);
};

/**
 * Provides an asynchronous PBKDF2 implementation.
 */
export const pbkdf2 = (
  password: string,
  salt: string,
  iterations: int,
  keylen: int,
  digest: string,
  callback: (err: Error | null, derivedKey: Uint8Array | null) => void
): void => {
  try {
    const result = pbkdf2Sync(password, salt, iterations, keylen, digest);
    callback(null, result);
  } catch (e) {
    callback(e instanceof Error ? e : new Error(String(e)), null);
  }
};

/**
 * Provides a synchronous scrypt implementation.
 */
export const scryptSync = (
  password: string | Uint8Array,
  salt: string | Uint8Array,
  keylen: int,
  _options?: unknown
): Uint8Array => {
  // TODO: actual scrypt implementation
  void password;
  void salt;
  return new Uint8Array(keylen);
};

/**
 * Provides an asynchronous scrypt implementation.
 */
export const scrypt = (
  password: string,
  salt: string,
  keylen: int,
  options: unknown,
  callback: (err: Error | null, derivedKey: Uint8Array | null) => void
): void => {
  try {
    const result = scryptSync(password, salt, keylen, options);
    callback(null, result);
  } catch (e) {
    callback(e instanceof Error ? e : new Error(String(e)), null);
  }
};

/**
 * Derives a key using the HKDF algorithm (synchronous).
 */
export const hkdfSync = (
  digest: string,
  ikm: Uint8Array,
  salt: Uint8Array,
  info: Uint8Array,
  keylen: int
): Uint8Array => {
  // TODO: actual HKDF implementation
  void digest;
  void ikm;
  void salt;
  void info;
  return new Uint8Array(keylen);
};

/**
 * Derives a key using the HKDF algorithm (async).
 */
export const hkdf = (
  digest: string,
  ikm: Uint8Array,
  salt: Uint8Array,
  info: Uint8Array,
  keylen: int,
  callback: (err: Error | null, derivedKey: Uint8Array | null) => void
): void => {
  try {
    const key = hkdfSync(digest, ikm, salt, info, keylen);
    callback(null, key);
  } catch (e) {
    callback(e instanceof Error ? e : new Error(String(e)), null);
  }
};

// ── Algorithm listings ─────────────────────────────────────────────────────

/**
 * Returns an array of the names of the supported cipher algorithms.
 */
export const getCiphers = (): string[] => {
  return [
    "aes-128-cbc",
    "aes-128-ecb",
    "aes-128-cfb",
    "aes-192-cbc",
    "aes-192-ecb",
    "aes-192-cfb",
    "aes-256-cbc",
    "aes-256-ecb",
    "aes-256-cfb",
    "des-cbc",
    "des-ecb",
    "des-ede3-cbc",
    "des-ede3-ecb",
    "rc2-cbc",
    "rc2-ecb",
  ];
};

/**
 * Returns an array of the names of the supported hash algorithms.
 */
export const getHashes = (): string[] => {
  return ["md5", "sha1", "sha256", "sha384", "sha512"];
};

/**
 * Returns an array of the names of the supported elliptic curves.
 */
export const getCurves = (): string[] => {
  return [
    "secp256r1",
    "secp384r1",
    "secp521r1",
    "secp256k1",
    "ed25519",
    "ed448",
    "x25519",
    "x448",
  ];
};

/**
 * Returns the default cipher list.
 */
export const getDefaultCipherList = (): string => {
  return getCiphers().join(":");
};

// ── Timing safe ────────────────────────────────────────────────────────────

/**
 * Test for equality in constant time.
 */
export const timingSafeEqual = (a: Uint8Array, b: Uint8Array): boolean => {
  if (a.length !== b.length) {
    return false;
  }

  // TODO: actual constant-time comparison
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a[i] ^ b[i];
  }
  return result === 0;
};

// ── Sign / Verify ──────────────────────────────────────────────────────────

/**
 * Creates a Sign object.
 */
export const createSign = (algorithm: string): Sign => {
  return new Sign(algorithm);
};

/**
 * Creates a Verify object.
 */
export const createVerify = (algorithm: string): Verify => {
  return new Verify(algorithm);
};

/**
 * Signs data using a private key (static convenience).
 */
export const sign = (
  algorithm: string | null,
  data: Uint8Array,
  privateKey: string | KeyObject
): Uint8Array => {
  const s = createSign(algorithm ?? "sha256");
  s.update(data);
  return s.sign(privateKey as string) as Uint8Array;
};

/**
 * Verifies a signature using a public key (static convenience).
 */
export const verify = (
  algorithm: string | null,
  data: Uint8Array,
  publicKey: string | KeyObject,
  signature: Uint8Array
): boolean => {
  const v = createVerify(algorithm ?? "sha256");
  v.update(data);
  return v.verify(publicKey as string, signature);
};

// ── Diffie-Hellman ─────────────────────────────────────────────────────────

/**
 * Creates a DiffieHellman key exchange object.
 */
export const createDiffieHellman = (
  primeOrLength: number | Uint8Array | string,
  generatorOrEncoding?: number | Uint8Array | string,
  generatorOrEncodingStr?: number | string,
  generatorEncoding?: string
): DiffieHellman => {
  if (typeof primeOrLength === "number") {
    if (typeof generatorOrEncoding === "number") {
      return createDiffieHellmanFromLength(
        primeOrLength,
        generatorOrEncoding
      );
    }
    return createDiffieHellmanFromLength(primeOrLength, 2);
  }

  if (primeOrLength instanceof Uint8Array) {
    const primeBytes: Uint8Array = primeOrLength;
    if (generatorOrEncoding instanceof Uint8Array) {
      const generatorBytes: Uint8Array = generatorOrEncoding;
      return createDiffieHellmanFromBytes(primeBytes, generatorBytes);
    }
    if (typeof generatorOrEncoding === "number") {
      return createDiffieHellmanFromBytes(
        primeBytes,
        new Uint8Array([generatorOrEncoding])
      );
    }
    return createDiffieHellmanFromBytes(primeBytes, new Uint8Array([2]));
  }

  // String prime with encoding
  // TODO: decode string prime
  void generatorOrEncodingStr;
  void generatorEncoding;
  return createDiffieHellmanFromBytes(new Uint8Array(0), new Uint8Array([2]));
};

/**
 * Gets a predefined Diffie-Hellman group by name.
 */
export const getDiffieHellman = (groupName: string): DiffieHellman => {
  if (!isValidGroup(groupName)) {
    throw new Error(`Unknown DH group: ${groupName}`);
  }

  const { prime, generator } = getGroup(groupName);
  return new DiffieHellman(prime, generator);
};

// ── ECDH ───────────────────────────────────────────────────────────────────

/**
 * Creates an ECDH key exchange object.
 */
export const createECDH = (curveName: string): ECDH => {
  return new ECDH(curveName);
};

// ── Key management ─────────────────────────────────────────────────────────

/**
 * Creates a KeyObject from a secret key.
 */
export const createSecretKey = (
  key: Uint8Array | string,
  encoding?: string
): KeyObject => {
  if (typeof key === "string") {
    // TODO: decode string key with encoding
    void encoding;
    return new SecretKeyObject(new Uint8Array(0));
  }

  return new SecretKeyObject(key);
};

/**
 * Creates a public KeyObject from a key.
 */
export const createPublicKey = (
  key: string | Uint8Array | KeyObject
): KeyObject => {
  if (key instanceof KeyObject) {
    if (key.type === "public") {
      return key;
    }

    if (key.type !== "private") {
      throw new Error("Key must be a private or public key");
    }

    // TODO: extract public key from private key
    return new PublicKeyObject(null, "rsa");
  }

  // TODO: parse PEM/DER key
  void key;
  return new PublicKeyObject(null, "rsa");
};

/**
 * Creates a private KeyObject from a key.
 */
export const createPrivateKey = (key: string | Uint8Array): KeyObject => {
  // TODO: parse PEM/DER key
  void key;
  return new PrivateKeyObject(null, "rsa");
};

/**
 * Generates a new asymmetric key pair synchronously.
 */
export const generateKeyPairSync = (
  type: string,
  _options?: unknown
): { publicKey: KeyObject; privateKey: KeyObject } => {
  const keyType = type.toLowerCase();

  if (keyType === "rsa") {
    // TODO: actual RSA key generation
    return {
      publicKey: new PublicKeyObject(null, "rsa"),
      privateKey: new PrivateKeyObject(null, "rsa"),
    };
  }

  if (keyType === "ec" || keyType === "ecdsa") {
    // TODO: actual EC key generation
    return {
      publicKey: new PublicKeyObject(null, "ec"),
      privateKey: new PrivateKeyObject(null, "ec"),
    };
  }

  if (
    keyType === "ed25519" ||
    keyType === "ed448" ||
    keyType === "x25519" ||
    keyType === "x448"
  ) {
    // TODO: actual EdDSA key generation
    return {
      publicKey: new EdDSAPublicKeyObject(null, keyType),
      privateKey: new EdDSAPrivateKeyObject(null, keyType),
    };
  }

  if (keyType === "dsa") {
    // TODO: actual DSA key generation
    return {
      publicKey: new DSAPublicKeyObject(null),
      privateKey: new DSAPrivateKeyObject(null),
    };
  }

  if (keyType === "dh") {
    const dh = getDiffieHellman("modp14");
    dh.generateKeys();
    const pub = dh.getPublicKey();
    const priv = dh.getPrivateKey();
    return {
      publicKey: new SecretKeyObject(pub as Uint8Array),
      privateKey: new SecretKeyObject(priv as Uint8Array),
    };
  }

  throw new Error(`Unknown key type: ${type}`);
};

/**
 * Generates a new asymmetric key pair asynchronously.
 */
export const generateKeyPair = (
  type: string,
  options: unknown,
  callback: (
    err: Error | null,
    publicKey: KeyObject | null,
    privateKey: KeyObject | null
  ) => void
): void => {
  try {
    const { publicKey, privateKey } = generateKeyPairSync(type, options);
    callback(null, publicKey, privateKey);
  } catch (e) {
    callback(e instanceof Error ? e : new Error(String(e)), null, null);
  }
};

/**
 * Generates a symmetric key for the specified algorithm.
 */
export const generateKey = (
  type: string,
  _options: unknown
): KeyObject => {
  // TODO: actual key generation with proper lengths per algorithm
  const keyBytes = new Uint8Array(32);
  return createSecretKey(keyBytes);
};

/**
 * Generates a symmetric key asynchronously.
 */
export const generateKeyAsync = (
  type: string,
  options: unknown,
  callback: (err: Error | null, key: KeyObject | null) => void
): void => {
  try {
    const key = generateKey(type, options);
    callback(null, key);
  } catch (e) {
    callback(e instanceof Error ? e : new Error(String(e)), null);
  }
};

// ── Encrypt / Decrypt ──────────────────────────────────────────────────────

/**
 * Encrypts data with a public key.
 */
export const publicEncrypt = (
  key: string | KeyObject,
  buffer: Uint8Array
): Uint8Array => {
  // TODO: actual RSA OAEP encryption
  void key;
  void buffer;
  return new Uint8Array(0);
};

/**
 * Decrypts data with a private key.
 */
export const privateDecrypt = (
  key: string | KeyObject,
  buffer: Uint8Array
): Uint8Array => {
  // TODO: actual RSA OAEP decryption
  void key;
  void buffer;
  return new Uint8Array(0);
};

/**
 * Decrypts data with a public key.
 */
export const publicDecrypt = (
  key: string | KeyObject,
  buffer: Uint8Array
): Uint8Array => {
  // TODO: actual RSA PKCS1 public decrypt (BouncyCastle-equivalent)
  void key;
  void buffer;
  return new Uint8Array(0);
};

/**
 * Encrypts data with a private key.
 */
export const privateEncrypt = (
  key: string | KeyObject,
  buffer: Uint8Array
): Uint8Array => {
  // TODO: actual RSA PKCS1 private encrypt (BouncyCastle-equivalent)
  void key;
  void buffer;
  return new Uint8Array(0);
};

// ── Hash static convenience ────────────────────────────────────────────────

/**
 * Computes a hash of the given data.
 */
export const hash = (
  algorithm: string,
  data: Uint8Array,
  _outputEncoding?: string
): Uint8Array => {
  const h = createHash(algorithm);
  h.update(data);
  return h.digest() as Uint8Array;
};

// ── FIPS ───────────────────────────────────────────────────────────────────

/**
 * Gets the FIPS mode status.
 */
export const getFips = (): boolean => {
  return false;
};

/**
 * Sets the FIPS mode.
 */
export const setFips = (enabled: boolean): void => {
  if (enabled) {
    throw new Error(
      "FIPS mode is not directly configurable. Use system-level FIPS policy instead."
    );
  }
};

// ── Legacy ─────────────────────────────────────────────────────────────────

/**
 * Sets the default encoding for crypto operations (deprecated).
 */
export const setDefaultEncoding = (_encoding: string): void => {
  // Legacy deprecated API - no-op
};

// ── Re-exports ─────────────────────────────────────────────────────────────

export {
  Certificate,
  Cipher,
  Decipher,
  DiffieHellman,
  DSAPrivateKeyObject,
  DSAPublicKeyObject,
  ECDH,
  EdDSAPrivateKeyObject,
  EdDSAPublicKeyObject,
  Hash,
  Hmac,
  KeyObject,
  PrivateKeyObject,
  PublicKeyObject,
  SecretKeyObject,
  Sign,
  Verify,
  X509CertificateInfo,
};
