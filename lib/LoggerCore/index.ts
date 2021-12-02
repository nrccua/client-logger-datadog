/* eslint-disable max-classes-per-file */
import { ILoggerMiddleware } from '../types';

export class LoggerInstance {
  constructor(private loggerCore: LoggerCore, private moduleName: string) {}

  public debug(message: string, ...args: unknown[]): void {
    this.loggerCore.debug(this.moduleName, message, ...args);
  }

  public info(message: string, ...args: unknown[]): void {
    this.loggerCore.info(this.moduleName, message, ...args);
  }

  public warn(message: string, ...args: unknown[]): void {
    this.loggerCore.warn(this.moduleName, message, ...args);
  }

  public error(message: string, ...args: unknown[]): void {
    this.loggerCore.error(this.moduleName, message, ...args);
  }
}

export class LoggerCore {
  private middlewares: ILoggerMiddleware[] = [];

  public addMiddleware(middleware: ILoggerMiddleware): void {
    this.middlewares.push(middleware);
  }

  public getLogger(moduleName: string): LoggerInstance {
    return new LoggerInstance(this, moduleName);
  }

  public debug(moduleName: string, message: string, ...args: unknown[]): void {
    this.middlewares.forEach(middleware => {
      middleware.onLog('debug', moduleName, message, ...args);
    });
  }

  public info(moduleName: string, message: string, ...args: unknown[]): void {
    this.middlewares.forEach(middleware => {
      middleware.onLog('info', moduleName, message, ...args);
    });
  }

  public warn(moduleName: string, message: string, ...args: unknown[]): void {
    this.middlewares.forEach(middleware => {
      middleware.onLog('warn', moduleName, message, ...args);
    });
  }

  public error(moduleName: string, message: string, ...args: unknown[]): void {
    this.middlewares.forEach(middleware => {
      middleware.onLog('error', moduleName, message, ...args);
    });
  }
}

export const Logger = new LoggerCore();
