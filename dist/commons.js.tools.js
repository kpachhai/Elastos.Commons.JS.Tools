'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var require$$0 = require('crypto');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e["default"] : e; }

var require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0);

class LogLevel {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}
class Logger {
    constructor(context) {
        this.context = context ? context : "";
        this.cid = this.initializeCID();
    }
    static setDefaultLevel(level) {
        Logger.DEFAULT_LOG_LEVEL = level;
    }
    static getDefaultLevel() {
        return Logger.DEFAULT_LOG_LEVEL;
    }
    setLevel(level) {
        this.logLevel = level;
    }
    getLevel() {
        return this.logLevel ? this.logLevel : Logger.DEFAULT_LOG_LEVEL;
    }
    levelIs(level) {
        let currentLevel = this.logLevel ? this.logLevel : Logger.DEFAULT_LOG_LEVEL;
        return level.id >= currentLevel.id;
    }
    initializeCID() {
        this.cid = Math.random().toString(36).substring(2, 9);
        return this.cid;
    }
    currentCID() {
        return this.cid;
    }
    resetCID() {
        this.cid = "";
    }
    log(...data) {
        if (this.getLevel().id <= Logger.INFO.id) {
            console.log(this.format(Logger.INFO, data));
        }
    }
    info(...data) {
        if (this.getLevel().id <= Logger.INFO.id) {
            console.log(this.format(Logger.INFO, data));
        }
    }
    debug(...data) {
        if (this.getLevel().id <= Logger.DEBUG.id) {
            console.log(this.format(Logger.DEBUG, data));
        }
    }
    trace(...data) {
        if (this.getLevel().id <= Logger.TRACE.id) {
            console.log(this.format(Logger.TRACE, data));
        }
    }
    warn(...data) {
        if (this.getLevel().id <= Logger.WARNING.id) {
            console.log(this.format(Logger.WARNING, data));
        }
    }
    error(...data) {
        if (this.getLevel().id <= Logger.ERROR.id) {
            console.log(this.format(Logger.ERROR, data));
        }
    }
    format(level, data) {
        let logLine = (new Date()).toISOString() + " " + level.name.toUpperCase() + " " + this.context + " " + (this.cid ? "(" + this.cid + ") " : "");
        if (!data || data.length < 1)
            return logLine;
        let content = String(data[0]);
        for (let i = 1; i < data.length; i++) {
            content = content.replace(/\{\}/, String(data[i]));
        }
        return logLine + " " + content;
    }
}
Logger.TRACE = new LogLevel(0, "TRACE");
Logger.DEBUG = new LogLevel(1, "DEBUG");
Logger.INFO = new LogLevel(2, "INFO");
Logger.WARNING = new LogLevel(3, "WARN");
Logger.ERROR = new LogLevel(4, "ERROR");
Logger.DEFAULT_LOG_LEVEL = Logger.TRACE;

class ParentException extends Error {
    constructor(message, causedBy) {
        super(message + (causedBy ? "\nCaused by: " + causedBy.message + (causedBy.stack ? "\nCaused by: " + causedBy.stack : "") : ""));
        this.causedBy = causedBy;
        Object.setPrototypeOf(this, new.target.prototype);
        let logger = new Logger(this.constructor.name);
        let stack = (causedBy ? "\nCaused by: " + causedBy.message + (causedBy.stack ? "\nCaused by: " + causedBy.stack : "") : "");
        logger.error(message + stack);
    }
    from(e) {
        this.message += (" Caused by " + e.message);
        return this;
    }
}
class IllegalArgumentException extends ParentException {
}
class NotImplementedException extends ParentException {
}
class HttpException extends ParentException {
    constructor(httpCode, message, causedBy) {
        super(message, causedBy);
        this.httpCode = httpCode;
    }
    getHttpCode() {
        return this.httpCode;
    }
}
class NodeRPCException extends ParentException {
    constructor(code, internalCode, message, causedBy) {
        super(message, causedBy);
        this.code = code;
        this.internalCode = internalCode ? internalCode : -1;
    }
    static forHttpCode(httpCode, message, internalCode, causedBy) {
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
    getCode() {
        return this.code;
    }
    getInternalCode() {
        return this.internalCode;
    }
}
NodeRPCException.BAD_REQUEST = 400;
NodeRPCException.UNAUTHORIZED = 401;
NodeRPCException.FORBIDDEN = 403;
NodeRPCException.NOT_FOUND = 404;
NodeRPCException.ALREADY_EXISTS = 455;
NodeRPCException.INSUFFICIENT_STORAGE = 507;
NodeRPCException.SERVER_EXCEPTION = 500;
NodeRPCException.IC_INVALID_PARAMETER = 1;
NodeRPCException.IC_BACKUP_IS_IN_PROCESSING = 2;
class InvalidParameterException extends NodeRPCException {
    constructor(message, causedBy, internalCode) {
        super(NodeRPCException.BAD_REQUEST, internalCode, message, causedBy);
    }
}
class UnauthorizedException extends NodeRPCException {
    constructor(message, causedBy, internalCode) {
        super(NodeRPCException.UNAUTHORIZED, internalCode, message, causedBy);
    }
}
class ForbiddenException extends NodeRPCException {
    constructor(message, causedBy, internalCode) {
        super(NodeRPCException.FORBIDDEN, internalCode, message, causedBy);
    }
}
class NotFoundException extends NodeRPCException {
    constructor(message, causedBy, internalCode) {
        super(NodeRPCException.NOT_FOUND, internalCode, message, causedBy);
    }
}
class AlreadyExistsException extends NodeRPCException {
    constructor(message, causedBy, internalCode) {
        super(NodeRPCException.ALREADY_EXISTS, internalCode, message, causedBy);
    }
}
class InsufficientStorageException extends NodeRPCException {
    constructor(message, causedBy, internalCode) {
        super(NodeRPCException.ALREADY_EXISTS, internalCode, message, causedBy);
    }
}
class ServerUnknownException extends NodeRPCException {
    constructor(httpCode, message, causedBy, internalCode) {
        super(httpCode, internalCode, message, causedBy);
    }
}

class Base64 {
    static fromString(value) {
        let base64string = Buffer.from(value, "utf-8").toString("base64");
        return this.convertToURI(base64string);
    }
    static fromHex(hexString) {
        return this.encode(hexString);
    }
    static fromUrlFormat(b64uString) {
        return this.convertFromURI(b64uString);
    }
    static toUrlFormat(b64String) {
        return this.convertToURI(b64String);
    }
    static toHex(b64String) {
        return this.decode(b64String);
    }
    static toString(b64String) {
        let b64str = b64String;
        if (!b64str.endsWith("="))
            b64str = this.convertFromURI(b64str);
        return Buffer.from(b64str, "base64").toString("utf-8");
    }
    static decode(b64uString) {
        let b64str = b64uString;
        if (!b64str.endsWith("="))
            b64str = this.convertFromURI(b64str);
        return Buffer.from(b64str, "base64").toString("hex");
    }
    static encode(hexToBase64) {
        let b64str = Buffer.from(hexToBase64, "hex").toString("base64");
        return this.convertToURI(b64str);
    }
    static convertToURI(b64str) {
        return b64str.replace(/[+/]/g, (item) => item == '+' ? '-' : '_').replace(/=+$/m, '');
    }
    static convertFromURI(b64ustr) {
        return b64ustr.replace(/[-_]/g, (item) => item == '-' ? '+' : '/') + '=';
    }
}

function checkArgument(condition, errorMessage) {
    if (!condition)
        throw new Error(errorMessage);
}
function checkEmpty(value, errorMessage) {
    checkArgument(value != null && value !== "", errorMessage);
}
function checkNotNull(value, errorMessage) {
    if (value === null) {
        throw new Error(errorMessage);
    }
}
function isEmpty(value) {
    return !value || value == null;
}
function isValidEmail(email) {
    if (!email)
        return false;
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
}

var validator = {
    __proto__: null,
    checkArgument: checkArgument,
    checkEmpty: checkEmpty,
    checkNotNull: checkNotNull,
    isEmpty: isEmpty,
    isValidEmail: isValidEmail
};

class CacheManager {
    constructor() { }
    static get(type, key) {
        try {
            let value = CacheManager.CACHE_MAP.get(CacheManager.buildKey(type, key));
            CacheManager.LOG.debug("Retrieved cached value for {}.{}: {}", type, key, value !== null && value !== void 0 ? value : "Not found");
            return value;
        }
        catch (e) {
            CacheManager.LOG.error("get: {}", e.message);
        }
        return null;
    }
    static set(type, key, value) {
        try {
            let cacheKey = CacheManager.buildKey(type, key);
            if (!value) {
                CacheManager.CACHE_MAP.delete(cacheKey);
                CacheManager.LOG.debug("Cleared cache entry {}.{}.", type, key);
            }
            else {
                CacheManager.CACHE_MAP.set(cacheKey, value);
                CacheManager.LOG.debug("Added cache entry {}.{}: {}", type, key, value);
            }
        }
        catch (e) {
            CacheManager.LOG.error("set: {}", e.message);
        }
    }
    static clear() {
        CacheManager.CACHE_MAP.clear();
        CacheManager.LOG.debug("Cache cleared.");
    }
    static clearType(type) {
        try {
            checkEmpty(type, "Cache type cannot be empty.");
            CacheManager.CACHE_MAP.forEach((value, key) => {
                if (key.startsWith(type + CacheManager.SEP)) {
                    CacheManager.CACHE_MAP.delete(key);
                }
            });
            CacheManager.LOG.debug("Cache type {} cleared.", type);
        }
        catch (e) {
            CacheManager.LOG.error("clearType: {}", e.message);
        }
    }
    static buildKey(type, key) {
        checkEmpty(type, "Cache type cannot be empty.");
        checkEmpty(key, "Cache key cannot be empty.");
        let strKey = key;
        if (typeof key != 'string') {
            if (typeof key['toString'] === 'function') {
                strKey = key.toString();
            }
            else {
                strKey = JSON.stringify(key);
                CacheManager.LOG.warn("Consider using a string, or a type with a 'toString()' method, as cache key.");
            }
        }
        return type + CacheManager.SEP + strKey;
    }
}
CacheManager.SEP = "$%$";
CacheManager.CACHE_MAP = new Map();
CacheManager.LOG = new Logger("CacheManager");

var createHash = require$$0__default.createHash;

var createHash$1 = createHash;

class SHA256 {
    static hashTwice(buffer) {
        let firstHash = createHash$1('sha256').update(buffer).digest();
        return createHash$1('sha256').update(firstHash).digest();
    }
    static sha256ripemd160(buffer) {
        let firstHash = createHash$1('sha256').update(buffer).digest();
        return createHash$1('ripemd160').update(firstHash).digest();
    }
    static encodeToString(...inputs) {
        let fullInput = inputs.reduce((acc, curr) => Buffer.concat([acc, curr]), Buffer.from(""));
        return createHash$1("sha256").update(fullInput).digest().toString();
    }
    static encodeToBuffer(...inputs) {
        let fullInput = inputs.reduce((acc, curr) => Buffer.concat([acc, curr]), Buffer.from(""));
        return createHash$1("sha256").update(fullInput).digest();
    }
}

function promisify(exec) {
    return new Promise((resolve, reject) => {
        try {
            let result = exec((e) => {
                reject(e);
            });
            resolve(result);
        }
        catch (e) {
            reject(e);
        }
    });
}
function hashCode(input) {
    if (typeof input === 'string') {
        var h = 0, i = input.length;
        while (i > 0) {
            h = (h << 5) - h + input.charCodeAt(--i) | 0;
        }
        return h;
    }
    if (typeof input === 'number') {
        return input;
    }
    if (typeof input === 'boolean') {
        return input === true ? 1231 : 1237;
    }
    throw new IllegalArgumentException("Unsupported type " + typeof input);
}

exports.AlreadyExistsException = AlreadyExistsException;
exports.Base64 = Base64;
exports.CacheManager = CacheManager;
exports.ForbiddenException = ForbiddenException;
exports.HttpException = HttpException;
exports.IllegalArgumentException = IllegalArgumentException;
exports.InsufficientStorageException = InsufficientStorageException;
exports.InvalidParameterException = InvalidParameterException;
exports.Logger = Logger;
exports.NodeRPCException = NodeRPCException;
exports.NotFoundException = NotFoundException;
exports.NotImplementedException = NotImplementedException;
exports.ParentException = ParentException;
exports.SHA256 = SHA256;
exports.ServerUnknownException = ServerUnknownException;
exports.UnauthorizedException = UnauthorizedException;
exports.Validators = validator;
exports.hashCode = hashCode;
exports.promisify = promisify;
