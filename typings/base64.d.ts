export declare class Base64 {
    static fromString(value: string): string;
    static fromHex(hexString: string): string;
    static fromUrlFormat(b64uString: string): string;
    static toUrlFormat(b64String: string): string;
    static toHex(b64String: string): string;
    static toString(b64String: string): string;
    static decode(b64uString: string): string;
    static encode(hexToBase64: string): string;
    private static convertToURI;
    private static convertFromURI;
}
