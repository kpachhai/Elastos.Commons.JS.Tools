import { Logger } from "../../src/logger";

describe("test Logger", () => {

    const testTime = "1111-11-11T11:11:11.111Z";
    let LAST_LOG: string;
    let realConsoleLogger = console.log;

    beforeAll(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date(testTime).getTime());
        console.log = (msg) => {
            LAST_LOG = msg;
        };
    });

    afterAll(() => {
        jest.useRealTimers();
        console.log = realConsoleLogger;
    });

    test("Set global logging level", () => {
        Logger.setDefaultLevel(Logger.TRACE);
        expect(Logger.getDefaultLevel()).toEqual(Logger.TRACE);
    });

    test("Set logger level", () => {
        Logger.setDefaultLevel(Logger.TRACE);
        let myLogger = new Logger("MyTestLogger");
        expect(myLogger.getLevel()).toEqual(Logger.TRACE);
        myLogger.setLevel(Logger.DEBUG);
        expect(myLogger.getLevel()).toEqual(Logger.DEBUG);
    });

    test("Validate logger levels", () => {
        const loggerName = "MyTestLogger";
        let myLogger = new Logger(loggerName);

        [
            Logger.TRACE.name,
            Logger.DEBUG.name,
            Logger.INFO.name,
            Logger.WARNING.name
        ].forEach((level, index) => {
            myLogger[level.toLowerCase()]("{} Msg", level);
            expect(LAST_LOG).toContain(testTime + " " + level + " " + loggerName + " (" + myLogger.currentCID() + ")  " + level + " Msg");
            //expect(LAST_LOG).toContain(level + " Msg");
            //expect(LAST_LOG).toContain(level);
        });
    });
});