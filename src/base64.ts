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

/**
 * Base64 static utility class
 */
export class Base64 {

    /**
     * Convert standard string to base64 string.
     * 
     * @param value Standard string to be converted.
     * @returns New base64 encoded string.
     */
    public static fromString(value: string): string{
        const base64string = Buffer.from(value, "utf-8").toString("base64");
        return  this.convertToURI(base64string)
    }

    /**
     * Convert hexadecimal string to base64 string.
     * 
     * @param hexString Hexadecimal string to be converted.
     * @returns New base64 encoded string.
     */
    public static fromHex(hexString: string): string{
       return this.encode(hexString)
    }
    
    /**
     * Convert URI encoded base64 string to base64 string.
     * 
     * @param b64uString URI encoded base64 string to be converted.
     * @returns New base64 encoded string.
     */
    public static fromUrlFormat(b64uString: string): string{
        return this.convertFromURI(b64uString)
    }

    /**
     * Convert base64 string to URI encoded base64 string.
     * 
     * @param b64String base64 string to be converted.
     * @returns New URI base64 encoded string.
     */
    public static toUrlFormat(b64String: string): string{
        return this.convertToURI(b64String)
    }

    /**
     * Convert base64 string to hexacimal string.
     * 
     * @param b64String base64 string to be converted.
     * @returns New decoded hexadecimal string.
     */
    public static toHex(b64String: string): string{
        return this.decode(b64String)
    }

    /**
     * Convert base64 string to string.
     * 
     * @param b64String base64 string to be converted.
     * @returns New decoded string.
     */
    public static toString(b64String: string): string{
        let b64str = b64String
        if (!b64str.endsWith("=")) b64str = this.convertFromURI(b64str)
        return Buffer.from(b64str, "base64").toString("utf-8")
    }

    /**
     * Convert base64 string to hexadecimal string.
     * 
     * Input string can be URI encoded.
     * 
     * @param b64uString base64 URI encoded string to be converted.
     * @returns New decoded hexadecimal string.
     */
    public static decode(b64uString: string): string {
        let b64str = b64uString
        if (!b64str.endsWith("=")) b64str = this.convertFromURI(b64str)
        return Buffer.from(b64str, "base64").toString("hex");
    }

    /**
     * Convert hexadecimal string to URI encoded base64 string.
     * 
     * @param hexToBase64 hexadecimal string to be converted.
     * @returns New URI encoded base64 string..
     */
    public static encode(hexString: string): string{
        const b64str = Buffer.from(hexString, "hex").toString("base64");
        return  this.convertToURI(b64str)
    }

    private static convertToURI(b64str: string) : string{
        return b64str.replace(/[+/]/g, (item) => item == '+' ? '-' : '_').replace(/=+$/m, '');
    }

    private static convertFromURI(b64ustr: string) : string{
        return b64ustr.replace(/[-_]/g, (item) => item == '-' ? '+' : '/') + '='
    }
}