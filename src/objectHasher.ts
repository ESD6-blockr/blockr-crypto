import { logger } from "@blockr/blockr-logger";
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
                logger.info(`Hashing object: ${object.constructor}`);

                resolve(createHash("md5").update(JSON.stringify(object)).digest("hex"));
            } catch (error) {
                logger.error(error.message);

                reject(error);
            }
        });
    }
}
