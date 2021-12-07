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

  public debug(message: string, ...args: unknown[]): void {
    this.middlewares.forEach(middleware => {
      middleware.onLog('debug', message, ...args);
    });
  }

  public log(message: string, ...args: unknown[]): void {
    this.middlewares.forEach(middleware => {
      middleware.onLog('log', message, ...args);
    });
  }

  public info(message: string, ...args: unknown[]): void {
    this.middlewares.forEach(middleware => {
      middleware.onLog('info', message, ...args);
    });
  }

  public warn(message: string, ...args: unknown[]): void {
    this.middlewares.forEach(middleware => {
      middleware.onLog('warn', message, ...args);
    });
  }

  public error(message: string, ...args: unknown[]): void {
    this.middlewares.forEach(middleware => {
      middleware.onLog('error', message, ...args);
    });
  }
}

export const Logger = new LoggerCore();
