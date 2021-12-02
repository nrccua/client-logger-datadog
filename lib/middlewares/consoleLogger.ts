import { ILoggerMiddleware, LogLevelStrings } from '../types';

/**
 * Middleware that logs received messages from Logger Core to the browser log
 */
export default class ConsoleLogger implements ILoggerMiddleware {
  // eslint-disable-next-line class-methods-use-this
  public onLog(level: LogLevelStrings, message: string, ...args: unknown[]): void {
    // eslint-disable-next-line no-console
    console[level](message, args);
  }
}
