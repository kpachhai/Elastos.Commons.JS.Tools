import { Base64 } from "../../src/base64";

const sourceString = "Source Value";
const sourceHexString = "44444444444444444444";
const sourceUrlString = "http://www.domain.tld/path/service?param1=1&param2=2";

describe("test Base64", () => {
    test("encode then decode (raw)", () => {
        let result = Base64.decode(Base64.encode(sourceHexString));
        expect(result).toEqual(sourceHexString);
    });

    test("encode then decode (string)", () => {
        let result = Base64.toString(Base64.fromString(sourceString));
        expect(result).toEqual(sourceString);
    });

    test("encode then decode (hex)", () => {
        let result = Base64.toHex(Base64.fromHex(sourceHexString));
        expect(result).toEqual(sourceHexString);
    });

    test("encode then decode (url format)", () => {
        let result = Base64.toString(Base64.fromUrlFormat(Base64.toUrlFormat(Base64.fromString(sourceUrlString))));
        expect(result).toEqual(sourceUrlString);
    });
});