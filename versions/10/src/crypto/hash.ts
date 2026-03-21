/**
 * Node.js crypto Hash class.
 *
 * Baseline: nodejs-clr/src/nodejs/crypto/Hash.cs
 */

/**
 * The Hash class is a utility for creating hash digests of data.
 */
export class Hash {
  private readonly _algorithm: string;
  private _finalized: boolean = false;

  public constructor(algorithm: string) {
    this._algorithm = algorithm;
  }

  /**
   * Updates the hash content with the given data.
   */
  public update(data: string, _inputEncoding?: string): Hash;
  public update(data: Uint8Array): Hash;
  public update(data: string | Uint8Array, _inputEncoding?: string): Hash {
    if (this._finalized) {
      throw new Error("Digest already called");
    }

    // TODO: actual hash update with data
    void data;
    return this;
  }

  /**
   * Calculates the digest of all data passed to be hashed.
   */
  public digest(encoding: string): string;
  public digest(): Uint8Array;
  public digest(outputLength: number): Uint8Array;
  public digest(encodingOrLength?: string | number): string | Uint8Array {
    if (this._finalized) {
      throw new Error("Digest already called");
    }

    this._finalized = true;

    if (typeof encodingOrLength === "number") {
      // TODO: SHAKE output length variant
      return new Uint8Array(encodingOrLength);
    }

    if (typeof encodingOrLength === "string") {
      // TODO: actual hash computation returning encoded string
      return "";
    }

    // TODO: actual hash computation returning raw bytes
    return new Uint8Array(0);
  }

  /**
   * Creates a copy of the Hash object in its current state.
   */
  public copy(): Hash {
    if (this._finalized) {
      throw new Error("Cannot copy finalized hash");
    }

    // TODO: actual state cloning
    return new Hash(this._algorithm);
  }
}
