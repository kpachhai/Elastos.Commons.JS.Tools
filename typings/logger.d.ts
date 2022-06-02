declare class LogLevel {
    id: number;
    name: string;
    constructor(id: number, name: string);
}
export declare class Logger {
    static TRACE: LogLevel;
    static DEBUG: LogLevel;
    static INFO: LogLevel;
    static WARNING: LogLevel;
    static ERROR: LogLevel;
    private context;
    private logLevel;
    private cid;
    private static DEFAULT_LOG_LEVEL;
    static setDefaultLevel(level: LogLevel): void;
    static getDefaultLevel(): LogLevel;
    setLevel(level: LogLevel): void;
    getLevel(): LogLevel;
    levelIs(level: LogLevel): boolean;
    constructor(context: string);
    initializeCID(): string;
    currentCID(): string;
    resetCID(): void;
    log(...data: any): void;
    info(...data: any): void;
    debug(...data: any): void;
    trace(...data: any): void;
    warn(...data: any): void;
    error(...data: any): void;
    private format;
}
export {};
