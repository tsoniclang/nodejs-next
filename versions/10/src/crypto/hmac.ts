/**
 * Node.js crypto Hmac class.
 *
 * Baseline: nodejs-clr/src/nodejs/crypto/Hmac.cs
 */

/**
 * The Hmac class is a utility for creating cryptographic HMAC digests.
 */
export class Hmac {
  private readonly _algorithm: string;
  private readonly _key: Uint8Array;
  private _finalized: boolean = false;

  public constructor(algorithm: string, key: Uint8Array) {
    this._algorithm = algorithm;
    this._key = key;
  }

  /**
   * Updates the Hmac content with the given data.
   */
  public update(data: string, _inputEncoding?: string): Hmac;
  public update(data: Uint8Array): Hmac;
  public update(data: string | Uint8Array, _inputEncoding?: string): Hmac {
    if (this._finalized) {
      throw new Error("Digest already called");
    }

    // TODO: actual HMAC update with data
    void data;
    return this;
  }

  /**
   * Calculates the HMAC digest of all the data passed.
   */
  public digest(encoding: string): string;
  public digest(): Uint8Array;
  public digest(encoding?: string): string | Uint8Array {
    if (this._finalized) {
      throw new Error("Digest already called");
    }

    this._finalized = true;

    if (typeof encoding === "string") {
      // TODO: actual HMAC computation returning encoded string
      void this._algorithm;
      void this._key;
      return "";
    }

    // TODO: actual HMAC computation returning raw bytes
    return new Uint8Array(0);
  }
}
