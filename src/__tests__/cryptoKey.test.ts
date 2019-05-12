import "reflect-metadata";
import { CryptoKeyUtil } from "../cryptoKeyUtil";
import { ObjectHasher } from "../objectHasher";
import { getTestObject } from "./constants/objects";

jest.mock("@blockr/blockr-logger");

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

    it("Should be unqiue each time", () => {
        const keyPairs = [];

        for (let i = 0; i < 100; i++) {
            keyPairs.push(cryptoKeyUtil.generateKeyPair());
        }

        for (let i = 0; i < 99; i++) {
            expect(keyPairs[i].getPublic()).not.toBe(keyPairs[i + 1].getPublic());
            expect(keyPairs[i].getPrivate()).not.toBe(keyPairs[i + 1].getPrivate());
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
        const verifyResult = cryptoKeyUtil.verifySignature(keyPair.getPublic().encode("hex", true) as string,
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
            cryptoKeyUtil.verifySignature(secondKeyPair.getPublic().encode("hex", true) as string,
                hash, signature);
        } catch (error) {
            expect(error.message).toBe("Signature does not match hash");
        }
    });
});
