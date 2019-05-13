import { createHash } from "crypto";
import { injectable } from "inversify";

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
                resolve(createHash("md5").update(JSON.stringify(object)).digest("hex"));
            } catch (error) {
                reject(error);
            }
        });
    }
}
