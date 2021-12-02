export enum LogLevel {
  debug = 0,
  info = 1,
  warn = 2,
  error = 3,
}

export type LogLevelStrings = keyof typeof LogLevel;

export interface ILoggerMiddleware {
  onLog(level: LogLevelStrings, moduleName: string, message: string, ...args: unknown[]): void;
}
