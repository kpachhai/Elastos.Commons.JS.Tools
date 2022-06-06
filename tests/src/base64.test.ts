import { Base64 } from "../../src/base64";

describe("test Base64", () => {
    test("encode then decode", () => {
        const sourceValue = "Source Value";
        let result = Base64.toString(Base64.fromString(sourceValue));
        expect(result).toEqual(sourceValue);
    });
});