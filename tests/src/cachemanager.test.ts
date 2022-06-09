import { CacheManager } from "../../src/cachemanager";

describe("test CacheManager", () => {
    test("store and retrieve", () => {
        const elementToCache = {
            "id":1,
            "data": "value"
        }
        CacheManager.set("newelement", elementToCache);
        const elementFromCache = CacheManager.get("newelement");
        expect(elementToCache['id']).toEqual(elementFromCache['id']);
        expect(elementToCache['data']).toEqual(elementFromCache['data']);
    });
});