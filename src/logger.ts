/*
 * Copyright (c) 2021 Elastos Foundation
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

class LogLevel {
    public id: number;
    public name: string;

    constructor (id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}

/**
 * Generic logger class using basic Log4J implementation.
 * 
 * Available logging levels:
 * 
 * Logger.TRACE
 * Logger.DEBUG
 * Logger.INFO
 * Logger.WARNING
 * Logger.ERROR
 * 
 * This logger uses the following format to print to console:
 * 
 * TIMESTAMP LEVEL LOGGER (CID) MESSAGE
 * 
 * Ex: 2022-05-27T03:59:51.576Z TRACE AuthService (6ms7lkj) Connecting to provider...
 * 
 * Message syntax follows Log4J implementation using '{}' placeholder:
 * 
 * let myLogger = new Logger("MyFirstLogger");
 * myLogger.initializeCID();
 * let firstName = "John"
 * let lastame = "Smith"
 * myLogger.debug("My name is {} {}", firstName, lastName);
 * 
 * Will output:
 * 
 * 2022-05-27T03:59:51.576Z DEBUG MyFirstLogger (6ms7lkj) My name is John Smith
 * 
 */
export class Logger {
    public static TRACE = new LogLevel(0, "TRACE");
    public static DEBUG = new LogLevel(1, "DEBUG");
    public static INFO = new LogLevel(2, "INFO");
    public static WARNING = new LogLevel(3, "WARN");
    public static ERROR = new LogLevel(4, "ERROR");

    private context: string;
    private logLevel: LogLevel;
    private cid: string;
    private static DEFAULT_LOG_LEVEL = Logger.TRACE;
    
    /**
     * Set global default logging level.
     * 
     * @param level New global logging level.
     */
    public static setDefaultLevel(level: LogLevel) {
        Logger.DEFAULT_LOG_LEVEL = level;
    }

    /**
     * Get current global logging level.
     * 
     * @returns Current global logging level.
     */
    public static getDefaultLevel(): LogLevel {
        return Logger.DEFAULT_LOG_LEVEL;
    }

    /**
     * Set logger level.
     * 
     * @param level New logging level.
     */
    public setLevel(level: LogLevel) {
        this.logLevel = level;
    }

    /**
     * Get current logging level.
     * 
     * @returns Current logging level.
     */
    public getLevel(): LogLevel {
        return this.logLevel ? this.logLevel : Logger.DEFAULT_LOG_LEVEL;
    }

    /**
     * Check if provided logging level will be printed out based on current logging level setting.
     * 
     * If no level is set for the current logger, the global level will be used.
     * 
     * @param level 
     * @returns 
     */
    public levelIs(level: LogLevel): boolean {
        let currentLevel = this.logLevel ? this.logLevel : Logger.DEFAULT_LOG_LEVEL;
        return level.id >= currentLevel.id;
    }

    /**
     * Create a new Logger instance for the specified context.
     * 
     * @param context String that identifies this new Logger.
     */
    public constructor(context: string) {
        this.context = context ? context : "";
        this.cid = this.initializeCID();
    }

    /**
     * Generate a unique ID to be used as a correlation id to link multiple related things.
     */
    public initializeCID(): string {
        // Math.random should be unique because of its seeding algorithm.
        // Convert it to base 36 (numbers + letters), and grab the first 9 characters
        // after the decimal.
        this.cid = Math.random().toString(36).substring(2, 9);
        return this.cid;
    }

    /**
     * Get current correlation id.
     * 
     * @returns The current correlation id.
     */
    public currentCID(): string {
        return this.cid;
    }

    /**
     * Clear the current correlation id.
     */
    public resetCID(): void {
        this.cid = "";
    }

    /**
     * Log the provided message using the INFO level.
     * 
     * @param data Data to be logged to console.
     */
    public log(...data: any) {
        if (this.getLevel().id <= Logger.INFO.id) {
            console.log(this.format(Logger.INFO, data));
        }
    }

    /**
     * Log the provided message using the INFO level.
     * 
     * @param data Data to be logged to console.
     */
    public info(...data: any) {
        if (this.getLevel().id <= Logger.INFO.id) {
            console.log(this.format(Logger.INFO, data));
        }
    }

    /**
     * Log the provided message using the DEBUG level.
     * 
     * @param data Data to be logged to console.
     */
    public debug(...data: any) {
        if (this.getLevel().id <= Logger.DEBUG.id) {
            console.log(this.format(Logger.DEBUG, data));
        }
    }

    /**
     * Log the provided message using the TRACE level.
     * 
     * @param data Data to be logged to console.
     */
    public trace(...data: any) {
        if (this.getLevel().id <= Logger.TRACE.id) {
            console.log(this.format(Logger.TRACE, data));
        }
    }

    /**
     * Log the provided message using the WARNING level.
     * 
     * @param data Data to be logged to console.
     */
    public warn(...data: any) {
        if (this.getLevel().id <= Logger.WARNING.id) {
            console.log(this.format(Logger.WARNING, data));
        }
    }

    /**
     * Log the provided message using the ERROR level.
     * 
     * @param data Data to be logged to console.
     */
    public error(...data: any) {
        if (this.getLevel().id <= Logger.ERROR.id) {
            console.log(this.format(Logger.ERROR, data));
        }
    }

    private format(level: LogLevel, data: any[]): string {
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