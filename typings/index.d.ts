import { IllegalArgumentException, ParentException, NotImplementedException, HttpException, NodeRPCException, InvalidParameterException, UnauthorizedException, ForbiddenException, NotFoundException, AlreadyExistsException, InsufficientStorageException, ServerUnknownException } from './exception';
import { Base64 } from './base64';
import { CacheManager } from './cachemanager';
import { Logger } from './logger';
import { SHA256 } from './sha256';
import * as Validators from './validator';
export declare function promisify<T>(exec: (reject?: (e: any) => void) => T): Promise<T>;
export declare function hashCode(input: string | number | boolean): number;
export { IllegalArgumentException, ParentException, NotImplementedException, HttpException, NodeRPCException, InvalidParameterException, UnauthorizedException, ForbiddenException, NotFoundException, AlreadyExistsException, InsufficientStorageException, ServerUnknownException, Base64, SHA256, CacheManager, Logger, Validators };
