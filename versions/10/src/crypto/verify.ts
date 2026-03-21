/**
 * Node.js crypto Verify class.
 *
 * Baseline: nodejs-clr/src/nodejs/crypto/Verify.cs
 */
import type { KeyObject } from "./key-object.ts";

/**
 * The Verify class is a utility for verifying signatures.
 */
export class Verify {
  private readonly _algorithm: string;
  private _finalized: boolean = false;

  public constructor(algorithm: string) {
    this._algorithm = algorithm;
  }

  /**
   * Updates the Verify content with the given data.
   */
  public update(data: string, _inputEncoding?: string): Verify;
  public update(data: Uint8Array): Verify;
  public update(data: string | Uint8Array, _inputEncoding?: string): Verify {
    if (this._finalized) {
      throw new Error("Verify already finalized");
    }

    // TODO: actual data buffering for verification
    void data;
    return this;
  }

  /**
   * Verifies the provided data using a PEM public key string and signature.
   */
  public verify(publicKey: string, signature: string, signatureEncoding?: string): boolean;
  public verify(publicKey: string, signature: Uint8Array): boolean;
  /**
   * Verifies the provided data using a KeyObject and signature.
   */
  public verify(publicKey: KeyObject, signature: string, signatureEncoding?: string): boolean;
  public verify(publicKey: KeyObject, signature: Uint8Array): boolean;
  public verify(
    publicKey: string | KeyObject,
    signature: string | Uint8Array,
    _signatureEncoding?: string
  ): boolean {
    if (this._finalized) {
      throw new Error("Verify already finalized");
    }

    this._finalized = true;

    // TODO: actual verification logic
    void publicKey;
    void signature;
    void this._algorithm;

    return false;
  }
}
