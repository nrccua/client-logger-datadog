import LoggerInstance from '../LoggerInstance';
import { ILoggerMiddleware } from '../types';

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

  public log(moduleName: string, message: string, ...args: unknown[]): void {
    this.middlewares.forEach(middleware => {
      middleware.onLog('log', moduleName, message, ...args);
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
