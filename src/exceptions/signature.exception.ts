export class SignatureException extends Error {
    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, SignatureException.prototype);
    }
}
