import { checkEmpty, checkNotNull } from "./validator";
import { Logger } from "./logger";

/**
 * Memory based static caching utility class. 
 * 
 * Cache keys are built from 2 parameters:
 *  - key: A string that identifies a caching element
 *  - type: An optional string that represents the type of the cached element. Can be used to cache multiple objects of the same type from different context.
 *          Ex: let session: Session = CacheManager.get("usersession"); let anonymousSession = CacheManager.get("usersession", "anonymous");
 */
export class CacheManager {

    private static EMPTY = "";
    private static SEP = "$%$";
    private static CACHE_MAP = new Map();
    private static LOG = new Logger("CacheManager");

    // This is a static class so there's no need to create an instance
    private constructor() {}

    /**
     * Retrieve an element from the cache.
     * 
     * @param key String key that identifies a cached element.
     * @param type Optional type of the cached element.
     * @returns Cached element or undefined if not found.
     */
    public static get(key: any, type: string = CacheManager.EMPTY): any {
        try {
            let value = CacheManager.CACHE_MAP.get(CacheManager.buildKey(type, key));
            CacheManager.LOG.debug("Retrieved cached value for {}.{}: {}", type, key, value ?? "Not found");
            return value;
        } catch (e) {
            CacheManager.LOG.error("get: {}", (e as Error).message);
        }
        return null;
    }

    /**
     * Add an element to the cache.
     * 
     * @param key String key that identifies the new element.
     * @param value Element to be cached.
     * @param type Optional type of the new cached element.
     */
    public static set(key: any, value: any, type: string = CacheManager.EMPTY): void {
        try {
            let cacheKey = CacheManager.buildKey(type, key);
            if (!value) {
                CacheManager.CACHE_MAP.delete(cacheKey);
                CacheManager.LOG.debug("Cleared cache entry {}.{}.", type, key);
            } else {
                CacheManager.CACHE_MAP.set(cacheKey, value);
                CacheManager.LOG.debug("Added cache entry {}.{}: {}", type, key, value);
            }
        } catch (e) {
            CacheManager.LOG.error("set: {}", (e as Error).message);
        }
    }

    /**
     * Clear the cache
     */
    public static clear(): void {
        CacheManager.CACHE_MAP.clear();
        CacheManager.LOG.debug("Cache cleared.");
    }

    /**
     * Clear everything element of the specified type from the cache.
     * 
     * @param type Type of the elements to be cleared.
     */
    public static clearType(type: string): void {
        try {
            checkEmpty(type, "Cache type cannot be empty.");
            CacheManager.CACHE_MAP.forEach((value: boolean, key: string) => {
                if (key.startsWith(type + CacheManager.SEP)) {
                    CacheManager.CACHE_MAP.delete(key);
                }
            });
            CacheManager.LOG.debug("Cache type {} cleared.", type);
        } catch (e) {
            CacheManager.LOG.error("clearType: {}", (e as Error).message);
        }
    }

    private static buildKey(type: string, key: any): string {
        checkNotNull(type, "Cache type cannot be null.");
        checkEmpty(key, "Cache key cannot be empty.");
        let strKey = key;
        if (typeof key != 'string') {
            if (typeof key['toString'] === 'function') {
                strKey = key.toString();
            } else {
                strKey = JSON.stringify(key);
                CacheManager.LOG.warn("Consider using a string, or a type with a 'toString()' method, as cache key.");
            }
        }
        return type + CacheManager.SEP + strKey;
    }
}