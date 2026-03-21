/**
 * Node.js crypto KeyObject types.
 *
 * Baseline: nodejs-clr/src/nodejs/crypto/KeyObject.cs
 */
import type { int } from "@tsonic/core/types.js";

/**
 * Represents a cryptographic key.
 */
export abstract class KeyObject {
  /**
   * The type of the key: 'secret', 'public', or 'private'.
   */
  public abstract get type(): string;

  /**
   * For asymmetric keys, this property returns the type of the key (e.g., 'rsa', 'ec', 'ed25519').
   * For secret keys, this property is undefined.
   */
  public abstract get asymmetricKeyType(): string | null;

  /**
   * For secret keys, this property returns the size of the key in bytes.
   * For asymmetric keys, this property is undefined.
   */
  public abstract get symmetricKeySize(): int | null;

  /**
   * Exports the key in the specified format.
   */
  public abstract export(options?: unknown): unknown;
}

/**
 * Represents a secret (symmetric) key.
 */
export class SecretKeyObject extends KeyObject {
  private readonly _keyData: Uint8Array;

  public constructor(keyData: Uint8Array) {
    super();
    this._keyData = keyData;
  }

  public get type(): string {
    return "secret";
  }

  public get asymmetricKeyType(): string | null {
    return null;
  }

  public get symmetricKeySize(): int {
    return this._keyData.length as int;
  }

  public export(_options?: unknown): Uint8Array {
    // TODO: actual export logic
    return this._keyData;
  }
}

/**
 * Represents a public key.
 */
export class PublicKeyObject extends KeyObject {
  private readonly _keyType: string;
  private readonly _keyData: unknown;

  public constructor(keyData: unknown, keyType: string) {
    super();
    this._keyData = keyData;
    this._keyType = keyType;
  }

  public get type(): string {
    return "public";
  }

  public get asymmetricKeyType(): string {
    return this._keyType;
  }

  public get symmetricKeySize(): null {
    return null;
  }

  public export(_options?: unknown): unknown {
    // TODO: actual PEM/DER export
    return this._keyData;
  }

  public exportFormatted(_format: string, _type?: string): string {
    // TODO: actual PEM/DER formatted export
    throw new Error("TODO: PublicKeyObject.exportFormatted not yet implemented");
  }
}

/**
 * Represents a private key.
 */
export class PrivateKeyObject extends KeyObject {
  private readonly _keyType: string;
  private readonly _keyData: unknown;

  public constructor(keyData: unknown, keyType: string) {
    super();
    this._keyData = keyData;
    this._keyType = keyType;
  }

  public get type(): string {
    return "private";
  }

  public get asymmetricKeyType(): string {
    return this._keyType;
  }

  public get symmetricKeySize(): null {
    return null;
  }

  public export(_options?: unknown): unknown {
    // TODO: actual PEM/DER export
    return this._keyData;
  }

  public exportFormatted(
    _format: string,
    _type?: string,
    _cipher?: string,
    _passphrase?: string
  ): string {
    // TODO: actual PEM/DER formatted export
    throw new Error("TODO: PrivateKeyObject.exportFormatted not yet implemented");
  }
}
