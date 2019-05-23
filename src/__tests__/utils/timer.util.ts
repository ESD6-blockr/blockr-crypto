/**
 * Simple timer utility class
 */
export class Timer {
    private time: number;

    constructor() {
        this.time = new Date().getTime();
    }

    public getSeconds(): number {
        return Math.ceil((new Date().getTime() - this.time) / 1000);
    }
}
