export enum LogLevel {
  debug = 0,
  log = 1,
  info = 2,
  warn = 3,
  error = 4,
  silent = 5,
}

export type LogLevelStrings = keyof typeof LogLevel;

export interface ILoggerMiddleware {
  onLog(level: LogLevelStrings, moduleName: string, message: string, ...args: unknown[]): void;
}
