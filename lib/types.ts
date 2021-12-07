export enum LogLevel {
  debug = 0,
  log = 1,
  info = 2,
  warn = 3,
  error = 4,
  silent = 5,
}

export type LogLevelStrings = keyof typeof LogLevel;

// export type TLoggerInstance = LoggerInstance;

export interface ILogger {
  debug(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  log(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error<T extends Error>(message: string | T, ...args: unknown[]): void;
}

export interface ILoggerMiddleware {
  onLog(level: LogLevelStrings, message: string, ...args: unknown[]): void;
}
