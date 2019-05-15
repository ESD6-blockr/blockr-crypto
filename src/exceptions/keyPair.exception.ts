export class KeyPairException extends Error {
    public reason: string;

    constructor(message: string, reason: string) {
        super(message);

        this.reason = reason;

        Object.setPrototypeOf(this, KeyPairException.prototype);
    }
}
