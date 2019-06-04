import "reflect-metadata";

import { ec as EC } from "elliptic";
import { injectable } from "inversify";
import { KeyPairException, SignatureException } from "./exceptions";
import { ObjectHasher } from "./objectHasher";
import { IKeyPair } from "./types";

/* Elliptic curve parameters */
const EC_PARAMETERS = "secp256k1";
/* Key pair encoding */
const KEY_ENC = "hex";

@injectable()
export class CryptoKeyUtil {
    private readonly ec: EC;
    private readonly hasher: ObjectHasher;

    constructor() {
        this.ec = new EC(EC_PARAMETERS);
        this.hasher = new ObjectHasher();
    }

    /**
     * Generate a new (EC) crypto key pair.
     * @returns {IKeyPair} EC key pair.
     * @throws {KeyPairException} when the generated key pair fails to verify.
     */
    public generateKeyPair(): IKeyPair {
        const keyPair = this.ec.genKeyPair();

        return this.validateKeyPair(keyPair);
    }

    /**
     * Verify if the key combinration is a valid keypair.
     * @param publicKey 
     * @param privateKey 
     * @returns {IKeyPair} EC key pair.
     */
    public async verifyKeyPair(publicKey: string, privateKey: string): Promise<IKeyPair> {
        try {
            const keyPair = this.ec.keyPair({
                priv: Buffer.from(privateKey, KEY_ENC),
                privEnc: KEY_ENC,
                pub: Buffer.from(publicKey, KEY_ENC),
                pubEnc: KEY_ENC,
            });

            this.validateKeyPair(keyPair);
            
            const hash = await this.hasher.hashAsync( { data: Math.random().toString(36) } );
            const signature = await this.createSignatureWithKeyPair(hash, keyPair);

            this.verifySignature(keyPair.getPublic(true, KEY_ENC) as string, hash, signature);
            
            return keyPair;
        } catch (error) {
            throw new KeyPairException("Key pair verification failed", error.message);
        }
    }

    /**
     * Create a signature of the hash with the supplied key pair.
     * @param hash reperesents (immutable) data.
     * @param keyPair 
     * @returns {string} Hex encoded signature.
     */
    public createSignatureWithKeyPair(hash: string, keyPair: IKeyPair): string {
        const signature = keyPair.sign(hash);
       
        return signature.toDER(KEY_ENC);
    }

    /**
     * Verify the signature is made with the same hash and public key.
     * @param publicKey Hex encoded string.
     * @param hash Hex encoded string.
     * @param signature Hex encoded string.
     * @returns {boolean} Verification result.
     */
    public verifySignature(publicKey: string, hash: string, signature: string): boolean {
        const key = this.ec.keyFromPublic(publicKey, KEY_ENC);
        
        if (key.verify(hash, signature)) {
            return true;
        }
        
        throw new SignatureException("Signature does not match hash");
    }

    private validateKeyPair(keyPair: IKeyPair): IKeyPair {
        const validationResult = keyPair.validate();

        if (validationResult.result) {
            return keyPair;
        }

        throw new KeyPairException("Key pair verification failed", validationResult.reason);
    }
}
