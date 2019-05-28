import "reflect-metadata";

import { createHash } from "crypto";
import { injectable } from "inversify";

/* Hash algorythm */
const HASH_ALGORITHM = "md5";
/* Encoding */
const ENCODING = "hex";

@injectable()
export class ObjectHasher {
    /**
     * Creates a md5 hash of the supplied object.
     * @param {T} object Object to be hashed.
     * @returns {string} returns a hex encoded string.
     */
    public hashAsync<T>(object: T): Promise<string> {
        return new Promise((resolve, reject) => {
            try {
                resolve(createHash(HASH_ALGORITHM).update(JSON.stringify(object)).digest(ENCODING));
            } catch (error) {
                reject(error);
            }
        });
    }
}
