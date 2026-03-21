/**
 * Node.js crypto Sign class.
 *
 * Baseline: nodejs-clr/src/nodejs/crypto/Sign.cs
 */
import type { KeyObject } from "./key-object.ts";

/**
 * The Sign class is a utility for generating signatures.
 */
export class Sign {
  private readonly _algorithm: string;
  private _finalized: boolean = false;

  public constructor(algorithm: string) {
    this._algorithm = algorithm;
  }

  /**
   * Updates the Sign content with the given data.
   */
  public update(data: string, _inputEncoding?: string): Sign;
  public update(data: Uint8Array): Sign;
  public update(data: string | Uint8Array, _inputEncoding?: string): Sign {
    if (this._finalized) {
      throw new Error("Sign already finalized");
    }

    // TODO: actual data buffering for signing
    void data;
    return this;
  }

  /**
   * Calculates the signature using a PEM private key string.
   */
  public sign(privateKey: string, outputEncoding: string): string;
  public sign(privateKey: string): Uint8Array;
  /**
   * Calculates the signature using a KeyObject.
   */
  public sign(privateKey: KeyObject, outputEncoding: string): string;
  public sign(privateKey: KeyObject): Uint8Array;
  public sign(
    privateKey: string | KeyObject,
    outputEncoding?: string
  ): string | Uint8Array {
    if (this._finalized) {
      throw new Error("Sign already finalized");
    }

    this._finalized = true;

    // TODO: actual signing logic
    void privateKey;
    void this._algorithm;

    if (typeof outputEncoding === "string") {
      return "";
    }

    return new Uint8Array(0);
  }
}
