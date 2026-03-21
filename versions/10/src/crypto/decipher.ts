/**
 * Node.js crypto Decipher class.
 *
 * Baseline: nodejs-clr/src/nodejs/crypto/Decipher.cs
 */

/**
 * Instances of the Decipher class are used to decrypt data.
 */
export class Decipher {
  private readonly _algorithm: string;
  private readonly _key: Uint8Array;
  private readonly _iv: Uint8Array | null;
  private readonly _isGcmMode: boolean;
  private _gcmTag: Uint8Array | null = null;
  private _gcmAad: Uint8Array | null = null;
  private _finalized: boolean = false;

  public constructor(algorithm: string, key: Uint8Array, iv: Uint8Array | null) {
    this._algorithm = algorithm;
    this._key = key;
    this._iv = iv;
    this._isGcmMode = algorithm.toLowerCase().includes("-gcm");
  }

  /**
   * Updates the decipher with data.
   */
  public update(data: string, inputEncoding?: string, outputEncoding?: string): string;
  public update(data: Uint8Array, outputEncoding?: string): string;
  public update(
    data: string | Uint8Array,
    _inputOrOutputEncoding?: string,
    _outputEncoding?: string
  ): string {
    if (this._finalized) {
      throw new Error("Decipher already finalized");
    }

    // TODO: actual decipher update
    void data;
    void this._algorithm;
    void this._key;
    void this._iv;
    return "";
  }

  /**
   * Returns any remaining deciphered contents.
   */
  public final(outputEncoding: string): string;
  public final(): Uint8Array;
  public final(outputEncoding?: string): string | Uint8Array {
    if (this._finalized) {
      throw new Error("Decipher already finalized");
    }

    this._finalized = true;

    if (typeof outputEncoding === "string") {
      // TODO: actual decipher finalization returning encoded string
      return "";
    }

    // TODO: actual decipher finalization returning raw bytes
    return new Uint8Array(0);
  }

  /**
   * When using an authenticated encryption mode, sets the authentication tag.
   */
  public setAuthTag(buffer: Uint8Array): void {
    if (!this._isGcmMode) {
      throw new Error("setAuthTag is only supported for GCM modes");
    }

    if (this._finalized) {
      throw new Error("Cannot set auth tag after finalization");
    }

    this._gcmTag = buffer;
    void this._gcmTag;
  }

  /**
   * When using an authenticated encryption mode, sets AAD (Additional Authenticated Data).
   */
  public setAAD(buffer: Uint8Array): void {
    if (!this._isGcmMode) {
      throw new Error("setAAD is only supported for GCM modes");
    }

    if (this._finalized) {
      throw new Error("Cannot set AAD after finalization");
    }

    this._gcmAad = buffer;
    void this._gcmAad;
  }
}
