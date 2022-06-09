/*
 * Copyright (c) 2021 Elastos Foundation
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import CryptoJS from 'crypto';

/**
 * SHA256 static utility class
 */
export class SHA256 {

    private constructor() {
        //
    }

    /**
     * Simple call forwarder to CryptoJS.createHash
     * 
     * @returns sha256 hash
     */
    public static createHash(algorithm = 'sha256'): CryptoJS.Hash {
        return CryptoJS.createHash(algorithm);
    }

    /**
     * Double hash the specified buffer using SHA256 algorithm.
     * 
     * @param buffer Buffer to hash.
     * @returns Hashed Buffer
     */
    public static hashTwice(buffer: Buffer): Buffer{
        const firstHash = CryptoJS.createHash('sha256').update(buffer).digest();
        return CryptoJS.createHash('sha256').update(firstHash).digest()
    }

    /**
     * Double hash the specified buffer using SHA256 and RIPEMD160 algorithms.
     * 
     * @param buffer Buffer to hash.
     * @returns Hashed Buffer
     */
    public static sha256ripemd160(buffer: Buffer): Buffer{
        const firstHash = CryptoJS.createHash('sha256').update(buffer).digest();
        return CryptoJS.createHash('ripemd160').update(firstHash).digest()
    }

    /**
     * Create hash of the specified buffers using SHA256 algorithm.
     * 
     * @param inputs Buffers to hash.
     * @returns Hashed String
     */
    public static encodeToString(...inputs: Buffer[]): string {
        const fullInput = inputs.reduce((acc, curr) => Buffer.concat([acc, curr]), Buffer.from(""));
        return CryptoJS.createHash("sha256").update(fullInput).digest().toString();
    }

    /**
     * Create hash of the specified buffers using SHA256 algorithm.
     * 
     * @param inputs Buffers to hash.
     * @returns Hashed Buffer
     */
    public static encodeToBuffer(...inputs: Buffer[]): Buffer {
        const fullInput = inputs.reduce((acc, curr) => Buffer.concat([acc, curr]), Buffer.from(""));
        return CryptoJS.createHash("sha256").update(fullInput).digest();
    }
}