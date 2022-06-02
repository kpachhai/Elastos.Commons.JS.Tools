export declare class CacheManager {
    private static SEP;
    private static CACHE_MAP;
    private static LOG;
    private constructor();
    static get(type: string, key: any): any;
    static set(type: string, key: any, value: any): void;
    static clear(): void;
    static clearType(type: string): void;
    private static buildKey;
}
