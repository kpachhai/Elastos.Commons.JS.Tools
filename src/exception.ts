import { Logger } from "./logger";

/**
 * Root Exception class
 */
export class ParentException extends Error {
    private causedBy?: Error;
    
    /**
     * Exception constructor. Prints the stacktrace of the new exception.
     * 
     * @param message Optional message linked to the new exception.
     * @param causedBy Optional cause of the new exception
     */
    constructor(message?: string, causedBy?: Error) {
        super(message + (causedBy ? "\nCaused by: " + causedBy.message + (causedBy.stack ? "\nCaused by: " + causedBy.stack : "") : ""));
        this.causedBy = causedBy;
        Object.setPrototypeOf(this, new.target.prototype);
        let logger = new Logger(this.constructor.name);
        let stack = (causedBy ? "\nCaused by: " + causedBy.message + (causedBy.stack ? "\nCaused by: " + causedBy.stack : "") : "");
        logger.error(message + stack);
    }
}

export class IllegalArgumentException extends ParentException  {}
export class NotImplementedException extends ParentException {} 

/**
 * Generic HTTP communication error.
 */
export class HttpException extends ParentException {
    private httpCode: number;

    /**
     * HttpException error.
     * 
     * @param httpCode HTTP Code number linked to this error.
     * @param message Message for this HTTP error.
     * @param causedBy Optional exception instance causing this error.
     */
    constructor(httpCode: number, message: string, causedBy?: Error) {
        super(message, causedBy);
        this.httpCode = httpCode;
    }

    /**
     * Get the HTTP code of this error
     * 
     * @returns HTTP code number
     */
    public getHttpCode(): number {
        return this.httpCode;
    }
}

/**
 * API HTTP communication error wrapper.
 * 
 * Used to create exceptions based of the provided HTTP error code constant:
 * 
 * NodeRPCException.BAD_REQUEST (400) => InvalidParameterException
 * NodeRPCException.UNAUTHORIZED (401) => UnauthorizedException
 * NodeRPCException.FORBIDDEN (403) => VaultForbiddenException
 * NodeRPCException.NOT_FOUND (404) => NotFoundException
 * NodeRPCException.ALREADY_EXISTS (455) => AlreadyExistsException
 * NodeRPCException.INSUFFICIENT_STORAGE (507) => InsufficientStorageException
 * NodeRPCException.SERVER_EXCEPTION (500) => ServerUnknownException
 * Any other code => ServerUnknownException
 */
export class NodeRPCException extends HttpException {
    private readonly internalCode: number;
   
    public static BAD_REQUEST = 400; //InvalidParameterException
	public static UNAUTHORIZED = 401; //UnauthorizedException
	public static FORBIDDEN	= 403; //VaultForbiddenException
	public static NOT_FOUND	= 404; //NotFoundException
	public static ALREADY_EXISTS = 455; //AlreadyExistsException
	public static INSUFFICIENT_STORAGE = 507; //InsufficientStorageException
    public static SERVER_EXCEPTION = 500; //ServerUnknownException
	public static IC_INVALID_PARAMETER = 1; //
	public static IC_BACKUP_IS_IN_PROCESSING = 2;

    constructor(httpCode: number, internalCode: number, message: string, causedBy?: Error) {
        super(httpCode, message, causedBy);
        this.internalCode = internalCode ? internalCode : -1;
    }

    /**
     * Builder method to create a new exception from HTTP code constant.
     * 
     * @param httpCode HTTP code constant.
     * @param message Error message.
     * @param internalCode Internal error code.
     * @param causedBy Error cause.
     * @returns New HTTP based exception instance.
     */
    public static forHttpCode(httpCode: number, message?: string, internalCode?: number, causedBy?: Error): NodeRPCException {
        switch (httpCode) {
            case NodeRPCException.UNAUTHORIZED:
                return new UnauthorizedException(message ? message : "", causedBy, internalCode);
            case NodeRPCException.FORBIDDEN:
                return new ForbiddenException(message ? message : "", causedBy, internalCode);
            case NodeRPCException.BAD_REQUEST:
                return new InvalidParameterException(message ? message : "", causedBy, internalCode);
            case NodeRPCException.NOT_FOUND:
                return new NotFoundException(message ? message : "", causedBy, internalCode);
            case NodeRPCException.ALREADY_EXISTS:
                return new AlreadyExistsException(message ? message : "", causedBy, internalCode);
            case NodeRPCException.INSUFFICIENT_STORAGE:
                return new InsufficientStorageException(message ? message : "", causedBy, internalCode);
            default:
                return new ServerUnknownException(httpCode, message ? message : "", causedBy, internalCode);
        }
    }

    /**
     * Get internal error code.
     * 
     * @returns Internal error code number.
     */
    public getInternalCode(): number {
        return this.internalCode;
    }
}

/**
 * HTTP Exception for NodeRPCException.BAD_REQUEST (400)
 */
export class InvalidParameterException extends NodeRPCException  {
    constructor(message: string, causedBy?: Error, internalCode?: number) {
        super(NodeRPCException.BAD_REQUEST, internalCode, message, causedBy);
    }
}

/**
 * HTTP Exception for NodeRPCException.UNAUTHORIZED (401)
 */
export class UnauthorizedException extends NodeRPCException  {
    constructor(message: string, causedBy?: Error, internalCode?: number) {
        super(NodeRPCException.UNAUTHORIZED, internalCode, message, causedBy);
    }
}

/**
 * HTTP Exception for NodeRPCException.FORBIDDEN (403)
 */
export class ForbiddenException extends NodeRPCException  {
    constructor(message: string, causedBy?: Error, internalCode?: number) {
        super(NodeRPCException.FORBIDDEN, internalCode, message, causedBy);
    }
}

/**
 * HTTP Exception for NodeRPCException.NOT_FOUND (404)
 */
export class NotFoundException extends NodeRPCException  {
    constructor(message: string, causedBy?: Error, internalCode?: number) {
        super(NodeRPCException.NOT_FOUND, internalCode, message, causedBy);
    }
}

/**
 * Custom Vault HTTP Exception for NodeRPCException.NOT_FOUND (404)
 */
export class VaultNotFoundException extends NodeRPCException  {
    constructor(message: string, causedBy?: Error, internalCode?: number) {
        super(NodeRPCException.NOT_FOUND, internalCode, message, causedBy);
    }
}

/**
 * HTTP Exception for NodeRPCException.ALREADY_EXISTS (455)
 */
export class AlreadyExistsException extends NodeRPCException  {
    constructor(message: string, causedBy?: Error, internalCode?: number) {
        super(NodeRPCException.ALREADY_EXISTS, internalCode, message, causedBy);
    }
}

/**
 * HTTP Exception for NodeRPCException.INSUFFICIENT_STORAGE (507)
 */
export class InsufficientStorageException extends NodeRPCException  {
    constructor(message: string, causedBy?: Error, internalCode?: number) {
        super(NodeRPCException.INSUFFICIENT_STORAGE, internalCode, message, causedBy);
    }
}

/**
 * HTTP Exception for NodeRPCException.SERVER_EXCEPTION, or any unhandled HTTP Code (500)
 */
export class ServerUnknownException extends NodeRPCException  {
    constructor(httpCode: number, message: string, causedBy?: Error, internalCode?: number) {
        super(httpCode, internalCode, message, causedBy);
    }
}
