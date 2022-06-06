import { CacheManager } from "../../src/cachemanager";

describe("test CacheManager", () => {
    test("store and retrieve", () => {
        let elementToCache = {
            "id":1,
            "data": "value"
        }
        CacheManager.set("newelement", elementToCache);
        let elementFromCache = CacheManager.get("newelement");
        expect(elementToCache.id).toEqual(elementFromCache.id);
        expect(elementToCache.data).toEqual(elementFromCache.data);
    });
});