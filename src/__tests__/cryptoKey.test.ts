import "reflect-metadata";

import { CryptoKeyUtil } from "../cryptoKeyUtil";
import { ObjectHasher } from "../objectHasher";
import { IKeyPair } from "../types";
import { getTestObject } from "./constants/objects";
import { Timer } from "./utils";

const KEY_ENC = "hex";
const GENERATION_AMOUNT: number = 500;

let cryptoKeyUtil: CryptoKeyUtil;
let objectHasher: ObjectHasher;

beforeEach(() => {
    cryptoKeyUtil = new CryptoKeyUtil();
    objectHasher = new ObjectHasher();
});

describe("Generating key pair", () => {
    it("Should succeed", () => {
        const keyPair = cryptoKeyUtil.generateKeyPair();

        expect(keyPair).not.toBeNull();
        expect(keyPair.getPublic()).not.toBeNull();
        expect(keyPair.getPrivate()).not.toBeNull();
    });

    it("Should take less then five seconds", () => {
        const timer = new Timer();

        cryptoKeyUtil.generateKeyPair();

        expect(timer.getSeconds()).toBeLessThan(5);
    });

    it("Should be unqiue each time", () => {
        const keyPairs = new Array<IKeyPair>(GENERATION_AMOUNT);

        for (let i = 0; i < GENERATION_AMOUNT; i++) {
            keyPairs[i] = (cryptoKeyUtil.generateKeyPair());
            expect(keyPairs.find((keyPair) => keyPair.getPublic() === keyPairs[i].getPublic())).not.toBeNull();
            expect(keyPairs.find((keyPair) => keyPair.getPrivate() === keyPairs[i].getPrivate())).not.toBeNull();
        }
    });
});

describe("Generating key pair from seperate keys", () => {
    it("Should succeed with valid public and private key strings", async () => {
        const keyPair = cryptoKeyUtil.generateKeyPair();

        const result = await cryptoKeyUtil.verifyKeyPair(
            keyPair.getPublic(true, KEY_ENC) as string, keyPair.getPrivate(KEY_ENC));

        expect(result).toBeDefined();
    });

    it("Should fail with invalid public and private key strings", async () => {
        try {
            const keyPair = cryptoKeyUtil.generateKeyPair();

            await cryptoKeyUtil.verifyKeyPair(keyPair.getPublic(true, KEY_ENC) as string, "private-key");
            fail();
        } catch (error) {
            expect(error).toBeDefined();
            expect(error.message).toBe("Key pair verification failed");
            expect(error.reason).toBe("Signature does not match hash");
        }
    });

    it("Should fail with invalid generated public and private key strings", async () => {
        try {
            const firstKeyPair = cryptoKeyUtil.generateKeyPair();
            const secondKeyPair = cryptoKeyUtil.generateKeyPair();

            await cryptoKeyUtil.verifyKeyPair(firstKeyPair.getPublic(true, KEY_ENC) as string,
                secondKeyPair.getPrivate(KEY_ENC));

            fail();
        } catch (error) {
            expect(error).toBeDefined();
            expect(error.message).toBe("Key pair verification failed");
            expect(error.reason).toBe("Signature does not match hash");
        }
    });
});

describe("Signing hash with key pair", () => {
    it("Should succeed with a valid key pair", async () => {
        const object = getTestObject(1);
        const hash = await objectHasher.hashAsync(object);
        const keyPair = cryptoKeyUtil.generateKeyPair();

        const signature = cryptoKeyUtil.createSignatureWithKeyPair(hash, keyPair);

        expect(signature).not.toBeNull();
    });
});

describe("Verifying signature", () => {
    it("Should succeed with the same public key", async () => {
        const object = getTestObject(1);
        const hash = await objectHasher.hashAsync(object);
        const keyPair = cryptoKeyUtil.generateKeyPair();

        const signature = cryptoKeyUtil.createSignatureWithKeyPair(hash, keyPair);
        const verifyResult = cryptoKeyUtil.verifySignature(keyPair.getPublic().encode(KEY_ENC, true) as string,
            hash, signature);

        expect(verifyResult).toBe(true);
    });

    it("Should fail with a different public key", async () => {
        const object = getTestObject(1);
        const hash = await objectHasher.hashAsync(object);
        const firstKeyPair = cryptoKeyUtil.generateKeyPair();
        const secondKeyPair = cryptoKeyUtil.generateKeyPair();

        const signature = cryptoKeyUtil.createSignatureWithKeyPair(hash, firstKeyPair);

        try {
            cryptoKeyUtil.verifySignature(secondKeyPair.getPublic().encode(KEY_ENC, true) as string,
                hash, signature);
            fail();
        } catch (error) {
            expect(error.message).toBe("Signature does not match hash");
        }
    });
});
