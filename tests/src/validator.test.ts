import { IllegalArgumentException } from '../../src/exception';
import { checkArgument, checkNotNull, checkEmpty, isEmpty, isValidEmail } from '../../src/validator';

describe("test validators", () => {
    test("checkArgument with invalid parameter", () => {
        const invalidArgument = () => {
            checkArgument(false, "Expected error.");
        }
        expect(invalidArgument).toThrow(IllegalArgumentException);
        expect(invalidArgument).toThrow("Expected error.");
    });
    test("checkArgument with valid parameter", () => {
        const validArgument = () => {
            checkArgument(true, "Unexpected error.");
            return true;
        }
        expect(validArgument).toBeTruthy();
    });

    test("checkNotNull with null parameter", () => {
        const invalidArgument = () => {
            checkNotNull(null, "Expected error.");
        }
        expect(invalidArgument).toThrow(IllegalArgumentException);
        expect(invalidArgument).toThrow("Expected error.");
    });
    test("checkNotNull with non-null parameter", () => {
        const validArgument = () => {
            checkNotNull("value", "Unexpected error.");
            return true;
        }
        expect(validArgument).toBeTruthy();
    });

    test("checkEmpty with null parameter", () => {
        const invalidArgument = () => {
            checkEmpty(null, "Expected error.");
        }
        expect(invalidArgument).toThrow(IllegalArgumentException);
        expect(invalidArgument).toThrow("Expected error.");
    });
    test("checkEmpty with empty parameter", () => {
        const invalidArgument = () => {
            checkEmpty("", "Expected error.");
        }
        expect(invalidArgument).toThrow(IllegalArgumentException);
        expect(invalidArgument).toThrow("Expected error.");
    });
    test("checkEmpty with non-empty parameter", () => {
        const validArgument = () => {
            checkEmpty("value", "Unexpected error.");
            return true;
        }
        expect(validArgument).toBeTruthy();
    });

    test("isEmpty with null parameter", () => {
        expect(isEmpty(null)).toBeTruthy();
    });
    test("isEmpty with empty parameter", () => {
        expect(isEmpty("")).toBeTruthy();
    });
    test("isEmpty with non-empty parameter", () => {
        expect(isEmpty("value")).toBeFalsy();
    });

    test("isValidEmail with null parameter", () => {
        expect(isValidEmail(null)).toBeFalsy();
    });
    test("isValidEmail with empty parameter", () => {
        expect(isValidEmail("")).toBeFalsy();
    });
    test("isValidEmail with invalid parameter", () => {
        expect(isValidEmail("invalid")).toBeFalsy();
        expect(isValidEmail("invalid@domain")).toBeFalsy();
        expect(isValidEmail("invalid.domain")).toBeFalsy();
        expect(isValidEmail("invalid.domain.tld")).toBeFalsy();
    });
    test("isValidEmail with valid parameter", () => {
        expect(isValidEmail("valid@domain.tld")).toBeTruthy();
    });
});