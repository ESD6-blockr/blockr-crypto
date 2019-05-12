import { logger } from "@blockr/blockr-logger";
import { ec as EC } from "elliptic";
import { injectable } from "inversify";
import { KeyPairException } from "./exceptions";
import { SignatureException } from "./exceptions/signature.exception";

@injectable()
export class CryptoKeyUtil {
    private ec: EC;

    constructor() {
        this.ec = new EC("secp256k1");
    }

    /**
     * Generate a new (EC) crypto key pair.
     * @returns {EC.KeyPair | IKeyPair} EC key pair.
     * @throws {KeyPairException} when the generated key pair fails to verify.
     */
    public generateKeyPair(): EC.KeyPair {
        logger.info("Generating key pair.");

        const keyPair = this.ec.genKeyPair();

        const validationResult = keyPair.validate();

        if (validationResult.result) {
            logger.info("Generated key pair successfully.");

            return keyPair;
        }

        throw new KeyPairException("Keypair generation failed", validationResult.reason);
    }

    /**
     * Create a signature of the hash with the supplied key pair.
     * @param hash reperesents (immutable) data.
     * @param keyPair 
     * @returns {string} Hex encoded signature.
     */
    public createSignatureWithKeyPair(hash: string, keyPair: EC.KeyPair): string {
        logger.info("Creating signature.");

        const signature = keyPair.sign(hash);
        return signature.toDER("hex");
    }

    /**
     * Verify the signature is made with the same hash and public key.
     * @param publicKey Hex encoded string.
     * @param hash Hex encoded string.
     * @param signature Hex encoded string.
     * @returns {boolean} Verification result.
     */
    public verifySignature(publicKey: string, hash: string, signature: string): boolean {
        logger.info("Verifying signature.");

        const key = this.ec.keyFromPublic(publicKey, "hex");
        
        if (key.verify(hash, signature)) {
            logger.info("Verified signature successfully.");

            return true;
        }
        
        throw new SignatureException("Signature does not match hash");
    }
}
