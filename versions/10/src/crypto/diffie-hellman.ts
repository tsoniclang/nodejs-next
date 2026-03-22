/**
 * Node.js crypto DiffieHellman class.
 *
 * Baseline: nodejs-clr/src/nodejs/crypto/DiffieHellman.cs
 */

/**
 * The DiffieHellman class is a utility for creating Diffie-Hellman key exchanges.
 */
export class DiffieHellman {
  private readonly _prime: Uint8Array;
  private readonly _generator: Uint8Array;
  private _privateKey: Uint8Array | null = null;
  private _publicKey: Uint8Array | null = null;

  public constructor(prime: Uint8Array, generator: Uint8Array);
  public constructor(primeLength: number);
  public constructor(primeLength: number, generator: number);
  public constructor(
    primeOrLength: Uint8Array | number,
    generatorOrValue?: Uint8Array | number
  ) {
    if (typeof primeOrLength === "number") {
      // TODO: generate DH parameters with given prime length
      this._prime = new Uint8Array(primeOrLength / 8);
      const gen = typeof generatorOrValue === "number" ? generatorOrValue : 2;
      this._generator = new Uint8Array([gen]);
    } else {
      this._prime = primeOrLength;
      if (generatorOrValue instanceof Uint8Array) {
        this._generator = generatorOrValue;
      } else {
        const gen = typeof generatorOrValue === "number" ? generatorOrValue : 2;
        this._generator = new Uint8Array([gen]);
      }
    }
  }

  /**
   * Generates private and public Diffie-Hellman key values.
   */
  public generateKeys(encoding?: undefined): Uint8Array;
  public generateKeys(encoding: string): string;
  public generateKeys(encoding?: string): string | Uint8Array {
    // TODO: actual DH key generation
    this._privateKey = new Uint8Array(this._prime.length);
    this._publicKey = new Uint8Array(this._prime.length);

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
  public computeSecret(otherPublicKey: Uint8Array, outputEncoding?: undefined): Uint8Array;
  public computeSecret(otherPublicKey: Uint8Array, outputEncoding: string): string;
  public computeSecret(
    otherPublicKey: string | Uint8Array,
    _inputOrOutputEncoding?: string,
    _outputEncoding?: string
  ): string | Uint8Array {
    if (this._privateKey === null) {
      throw new Error("Must call generateKeys() first");
    }

    // TODO: actual DH shared secret computation
    void otherPublicKey;
    if (typeof otherPublicKey === "string" || typeof _inputOrOutputEncoding === "string") {
      return "";
    }

    return new Uint8Array(this._prime.length);
  }

  /**
   * Returns the Diffie-Hellman prime.
   */
  public getPrime(encoding?: undefined): Uint8Array;
  public getPrime(encoding: string): string;
  public getPrime(encoding?: string): string | Uint8Array {
    if (typeof encoding === "string") {
      // TODO: return encoded prime
      return "";
    }

    return this._prime;
  }

  /**
   * Returns the Diffie-Hellman generator.
   */
  public getGenerator(encoding?: undefined): Uint8Array;
  public getGenerator(encoding: string): string;
  public getGenerator(encoding?: string): string | Uint8Array {
    if (typeof encoding === "string") {
      // TODO: return encoded generator
      return "";
    }

    return this._generator;
  }

  /**
   * Returns the Diffie-Hellman public key.
   */
  public getPublicKey(encoding?: undefined): Uint8Array;
  public getPublicKey(encoding: string): string;
  public getPublicKey(encoding?: string): string | Uint8Array {
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
   * Returns the Diffie-Hellman private key.
   */
  public getPrivateKey(encoding?: undefined): Uint8Array;
  public getPrivateKey(encoding: string): string;
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
   * Sets the Diffie-Hellman public key.
   */
  public setPublicKey(publicKey: string, encoding?: string): void;
  public setPublicKey(publicKey: Uint8Array): void;
  public setPublicKey(publicKey: string | Uint8Array, _encoding?: string): void {
    if (typeof publicKey === "string") {
      // TODO: decode and set
    } else {
      this._publicKey = publicKey;
    }
  }

  /**
   * Sets the Diffie-Hellman private key.
   */
  public setPrivateKey(privateKey: string, encoding?: string): void;
  public setPrivateKey(privateKey: Uint8Array): void;
  public setPrivateKey(privateKey: string | Uint8Array, _encoding?: string): void {
    if (typeof privateKey === "string") {
      // TODO: decode and set
    } else {
      this._privateKey = privateKey;
      // TODO: recalculate public key
      this._publicKey = new Uint8Array(this._prime.length);
    }
  }

  /**
   * Returns the DH validation error code.
   */
  public getVerifyError(): number {
    return 0;
  }
}
