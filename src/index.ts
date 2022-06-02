import {
    IllegalArgumentException,
    ParentException,
    NotImplementedException,
    HttpException,
    NodeRPCException,
    InvalidParameterException,
    UnauthorizedException,
    ForbiddenException,
    NotFoundException,
    AlreadyExistsException,
    InsufficientStorageException,
    ServerUnknownException
} from './exception'
import { Base64 } from './base64'
import { CacheManager } from './cachemanager'
import { Logger } from './logger'
import { SHA256 } from './sha256'
import * as Validators from './validator'

export function promisify<T>(exec: (reject?: (e)=>void)=>T): Promise<T> {
    return new Promise((resolve, reject)=>{
        try {
            let result: T = exec((e)=>{
                reject(e);
            });
            resolve(result);
        }
        catch (e) {
            reject (e);
        }
    })
}

export function hashCode(input: string | number | boolean): number {
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

export {
    IllegalArgumentException,
    ParentException,
    NotImplementedException,
    HttpException,
    NodeRPCException,
    InvalidParameterException,
    UnauthorizedException,
    ForbiddenException,
    NotFoundException,
    AlreadyExistsException,
    InsufficientStorageException,
    ServerUnknownException,
    Base64,
    SHA256,
    CacheManager,
    Logger,
    Validators
}