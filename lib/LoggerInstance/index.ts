import moment from 'moment';

import type { LoggerCore } from '../LoggerCore';

export default class LoggerInstance {
  constructor(private loggerCore: LoggerCore, private moduleName: string) {}

  private get prefix(): string {
    const date = moment();
    return `(${date.utc().format('YYYY-MM-DDTHH:mm:ss.SSS')}) [${this.moduleName}]`;
  }

  public debug(message: string, ...args: unknown[]): void {
    this.loggerCore.debug(this.moduleName, `${this.prefix} ${message}`, ...args);
  }

  public info(message: string, ...args: unknown[]): void {
    this.loggerCore.info(this.moduleName, `${this.prefix} ${message}`, ...args);
  }

  public log(message: string, ...args: unknown[]): void {
    this.loggerCore.log(this.moduleName, `${this.prefix} ${message}`, ...args);
  }

  public warn(message: string, ...args: unknown[]): void {
    this.loggerCore.warn(this.moduleName, `${this.prefix} ${message}`, ...args);
  }

  public error<T extends Error>(message: string | T, ...args: unknown[]): void {
    this.loggerCore.error(this.moduleName, `${this.prefix} ${String(message)}`, ...args);
  }
}
