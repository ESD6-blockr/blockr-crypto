import "reflect-metadata";

import { ObjectHasher } from "../objectHasher";
import { getTestObject } from "./constants/objects";

let objectHasher: ObjectHasher;

beforeEach(() => {
    objectHasher = new ObjectHasher();
});

describe("Generating hash", () => {
    it("Should succeed with a valid object", async () => {
        const object = getTestObject(1);

        const hash = await objectHasher.hashAsync(object);

        expect(hash).not.toBeNull();
    });
});

describe("Verifying hash", () => {
    it("Should succeed when using the same object", async () => {
        const object = getTestObject(2);

        const hash = await objectHasher.hashAsync(object);

        expect(hash).toBe(await objectHasher.hashAsync(object));
    });

    it("Should fail when using a different object", async () => {
        const firstObject = getTestObject(3);
        const secondObject = getTestObject(4);

        const hash = await objectHasher.hashAsync(firstObject);

        expect(hash).not.toBe(await objectHasher.hashAsync(secondObject));
    });
});

