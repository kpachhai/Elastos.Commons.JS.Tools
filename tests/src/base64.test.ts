import { Base64 } from "../../src/base64";

describe("test Base64", () => {
    test("encode", () => {
        let result = Base64.encode("patate");
        expect(result).toEqual("");
    });
});