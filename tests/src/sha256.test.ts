import { SHA256 } from '../../src/sha256';

const inputBuffer = Buffer.from("inputBuffer");

describe("test SHA256", () => {
    test("hashTwice", () => {
        let firstHash = SHA256.hashTwice(inputBuffer).toString();
        let secondHash = SHA256.hashTwice(Buffer.from("Other inputBuffer")).toString();
        let thirdHash = SHA256.hashTwice(inputBuffer).toString();
        let manualHash = SHA256.createHash().update(SHA256.createHash().update(inputBuffer).digest()).digest().toString();
        expect(firstHash).not.toBeUndefined();
        expect(firstHash).not.toBeNull();
        expect(secondHash).not.toBeUndefined();
        expect(secondHash).not.toBeNull();
        expect(firstHash).toContain(thirdHash);
        expect(firstHash).not.toContain(secondHash);
        expect(firstHash).toContain(manualHash);
    });

    test("sha256ripemd160", () => {
        let firstHash = SHA256.sha256ripemd160(inputBuffer).toString();
        let manualHash = SHA256.createHash('ripemd160').update(SHA256.createHash().update(inputBuffer).digest()).digest().toString();
        expect(firstHash).not.toBeUndefined();
        expect(firstHash).not.toBeNull();
        expect(firstHash).toContain(manualHash);
    });

    test("encodeToString", () => {
        let singleBuffer = SHA256.encodeToString(inputBuffer);
        let multipleBuffers = SHA256.encodeToString(inputBuffer.slice(0, 5), inputBuffer.slice(5));
        expect(singleBuffer).toContain(multipleBuffers);
    });

    test("encodeToBuffer", () => {
        let singleBuffer = SHA256.encodeToBuffer(inputBuffer).toString();
        let multipleBuffers = SHA256.encodeToBuffer(inputBuffer.slice(0, 5), inputBuffer.slice(5)).toString();
        let singleBufferString = SHA256.encodeToString(inputBuffer);
        expect(singleBuffer).toContain(multipleBuffers);
        expect(singleBuffer).toContain(singleBufferString);
    });
});