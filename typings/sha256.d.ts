/// <reference types="node" />
export declare class SHA256 {
    static hashTwice(buffer: Buffer): Buffer;
    static sha256ripemd160(buffer: Buffer): Buffer;
    static encodeToString(...inputs: Buffer[]): string;
    static encodeToBuffer(...inputs: Buffer[]): Buffer;
}
