/**
 * Node.js crypto ECDH class.
 *
 * Baseline: nodejs-clr/src/nodejs/crypto/ECDH.cs
 */

/**
 * The ECDH class is a utility for creating Elliptic Curve Diffie-Hellman (ECDH) key exchanges.
 */
export class ECDH {
  private readonly _curveName: string;
  private _publicKey: Uint8Array | null = null;
  private _privateKey: Uint8Array | null = null;

  public constructor(curveName: string) {
    this._curveName = curveName;
    // TODO: validate curve name
    void this._curveName;
  }

  /**
   * Generates private and public EC Diffie-Hellman key values.
   */
  public generateKeys(encoding?: string, _format?: string): string;
  public generateKeys(): Uint8Array;
  public generateKeys(encoding?: string, _format?: string): string | Uint8Array {
    // TODO: actual EC key generation
    this._publicKey = new Uint8Array(65);
    this._privateKey = new Uint8Array(32);

    if (typeof encoding === "string") {
      // TODO: return encoded public key
      return "";
    }

    return this._publicKey;
  }

  /**
   * Computes the shared secret using the other party's public key.
   */
  public computeSecret(
    otherPublicKey: string,
    inputEncoding?: string,
    outputEncoding?: string
  ): string;
  public computeSecret(otherPublicKey: Uint8Array, outputEncoding: string): string;
  public computeSecret(otherPublicKey: Uint8Array): Uint8Array;
  public computeSecret(
    otherPublicKey: string | Uint8Array,
    _inputOrOutputEncoding?: string,
    _outputEncoding?: string
  ): string | Uint8Array {
    // TODO: actual EC shared secret computation
    void otherPublicKey;
    if (typeof otherPublicKey === "string" || typeof _inputOrOutputEncoding === "string") {
      return "";
    }

    return new Uint8Array(32);
  }

  /**
   * Returns the EC Diffie-Hellman public key.
   */
  public getPublicKey(encoding?: string, _format?: string): string;
  public getPublicKey(): Uint8Array;
  public getPublicKey(encoding?: string, _format?: string): string | Uint8Array {
    if (this._publicKey === null) {
      throw new Error("Must call generateKeys() first");
    }

    if (typeof encoding === "string") {
      // TODO: return encoded public key
      return "";
    }

    return this._publicKey;
  }

  /**
   * Returns the EC Diffie-Hellman private key.
   */
  public getPrivateKey(encoding: string): string;
  public getPrivateKey(): Uint8Array;
  public getPrivateKey(encoding?: string): string | Uint8Array {
    if (this._privateKey === null) {
      throw new Error("Must call generateKeys() first");
    }

    if (typeof encoding === "string") {
      // TODO: return encoded private key
      return "";
    }

    return this._privateKey;
  }

  /**
   * Sets the EC Diffie-Hellman public key (deprecated, throws).
   */
  public setPublicKey(_publicKey: string, _encoding?: string): void;
  public setPublicKey(_publicKey: Uint8Array): void;
  public setPublicKey(_publicKey: string | Uint8Array, _encoding?: string): void {
    throw new Error("setPublicKey() is not supported. Use setPrivateKey() instead.");
  }

  /**
   * Sets the EC Diffie-Hellman private key.
   */
  public setPrivateKey(privateKey: string, encoding?: string): void;
  public setPrivateKey(privateKey: Uint8Array): void;
  public setPrivateKey(privateKey: string | Uint8Array, _encoding?: string): void {
    if (typeof privateKey === "string") {
      // TODO: decode and import
    } else {
      // TODO: import EC private key
      this._privateKey = privateKey;
    }
  }
}
