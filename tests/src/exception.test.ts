import {
    ParentException,
    NodeRPCException,
    NotFoundException,
    InvalidParameterException,
    UnauthorizedException,
    ForbiddenException,
    AlreadyExistsException,
    InsufficientStorageException,
    ServerUnknownException,
    NotImplementedException
 } from "../../src/exception"

class CustomException extends ParentException {}

describe("test HTTP Exceptions", () => {
    test("Validate BAD_REQUEST", () => {
        const exception = NodeRPCException.forHttpCode(NodeRPCException.BAD_REQUEST);
        expect(exception).toBeInstanceOf(InvalidParameterException);
        expect(exception.getHttpCode()).toEqual(400);
    });
    test("Validate UNAUTHORIZED", () => {
        const exception = NodeRPCException.forHttpCode(NodeRPCException.UNAUTHORIZED);
        expect(exception).toBeInstanceOf(UnauthorizedException);
        expect(exception.getHttpCode()).toEqual(401);
    });
    test("Validate FORBIDDEN", () => {
        const exception = NodeRPCException.forHttpCode(NodeRPCException.FORBIDDEN);
        expect(exception).toBeInstanceOf(ForbiddenException);
        expect(exception.getHttpCode()).toEqual(403);
    });
    test("Validate NOTFOUND", () => {
        const exception = NodeRPCException.forHttpCode(NodeRPCException.NOT_FOUND);
        expect(exception).toBeInstanceOf(NotFoundException);
        expect(exception.getHttpCode()).toEqual(404);
    });
    test("Validate ALREADY_EXISTS", () => {
        const exception = NodeRPCException.forHttpCode(NodeRPCException.ALREADY_EXISTS);
        expect(exception).toBeInstanceOf(AlreadyExistsException);
        expect(exception.getHttpCode()).toEqual(455);
    });
    test("Validate INSUFFICIENT_STORAGE", () => {
        const exception = NodeRPCException.forHttpCode(NodeRPCException.INSUFFICIENT_STORAGE);
        expect(exception).toBeInstanceOf(InsufficientStorageException);
        expect(exception.getHttpCode()).toEqual(507);
    });
    test("Validate SERVER_EXCEPTION", () => {
        const exception = NodeRPCException.forHttpCode(NodeRPCException.SERVER_EXCEPTION);
        expect(exception).toBeInstanceOf(ServerUnknownException);
        expect(exception.getHttpCode()).toEqual(500);
    });
    test("Validate default error", () => {
        const exception = NodeRPCException.forHttpCode(123);
        expect(exception).toBeInstanceOf(ServerUnknownException);
        expect(exception.getHttpCode()).toEqual(123);
    });
    test("Validate custom HTTP error", () => {
        const sourceException = new CustomException("Source Exception");
        const exception = NodeRPCException.forHttpCode(123, "My HTTP Error", 250, sourceException);
        expect(exception).toBeInstanceOf(ServerUnknownException);
        expect(exception.getHttpCode()).toEqual(123);
        expect(exception.getMessage()).toContain("My HTTP Error");
        expect(exception.getInternalCode()).toEqual(250);
        expect(exception.getCause()).toBe(sourceException);
    });
});

describe("test Exceptions construction", () => {
    test("create with cause", () => {
        const sourceException = new CustomException("Source Exception");
        const exception = new NotImplementedException("New Exception", sourceException)
        const exceptionMessage = exception.getMessage();
        expect(exceptionMessage).not.toEqual("New Exception");
        expect(exceptionMessage).toContain("New Exception");
        expect(exceptionMessage).toContain("Source Exception");
        expect(exceptionMessage).toContain("Caused by");
        expect(exception.getCause()).toBe(sourceException);
        const cause = sourceException as ParentException;
        expect(cause.getMessage()).toEqual("Source Exception");
    });
});