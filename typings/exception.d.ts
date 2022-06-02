export declare class ParentException extends Error {
    private causedBy?;
    constructor(message?: string, causedBy?: Error);
    from(e: any): this;
}
export declare class IllegalArgumentException extends ParentException {
}
export declare class NotImplementedException extends ParentException {
}
export declare class HttpException extends ParentException {
    private httpCode;
    constructor(httpCode: number, message: string, causedBy?: Error);
    getHttpCode(): number;
}
export declare class NodeRPCException extends ParentException {
    private readonly code;
    private readonly internalCode;
    static BAD_REQUEST: number;
    static UNAUTHORIZED: number;
    static FORBIDDEN: number;
    static NOT_FOUND: number;
    static ALREADY_EXISTS: number;
    static INSUFFICIENT_STORAGE: number;
    static SERVER_EXCEPTION: number;
    static IC_INVALID_PARAMETER: number;
    static IC_BACKUP_IS_IN_PROCESSING: number;
    constructor(code: number, internalCode: number, message: string, causedBy?: Error);
    static forHttpCode(httpCode: number, message?: string, internalCode?: number, causedBy?: Error): NodeRPCException;
    getCode(): number;
    getInternalCode(): number;
}
export declare class InvalidParameterException extends NodeRPCException {
    constructor(message: string, causedBy?: Error, internalCode?: number);
}
export declare class UnauthorizedException extends NodeRPCException {
    constructor(message: string, causedBy?: Error, internalCode?: number);
}
export declare class ForbiddenException extends NodeRPCException {
    constructor(message: string, causedBy?: Error, internalCode?: number);
}
export declare class NotFoundException extends NodeRPCException {
    constructor(message: string, causedBy?: Error, internalCode?: number);
}
export declare class VaultNotFoundException extends NodeRPCException {
    constructor(message: string, causedBy?: Error, internalCode?: number);
}
export declare class AlreadyExistsException extends NodeRPCException {
    constructor(message: string, causedBy?: Error, internalCode?: number);
}
export declare class InsufficientStorageException extends NodeRPCException {
    constructor(message: string, causedBy?: Error, internalCode?: number);
}
export declare class ServerUnknownException extends NodeRPCException {
    constructor(httpCode: number, message: string, causedBy?: Error, internalCode?: number);
}
