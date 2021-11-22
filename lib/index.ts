/* eslint-disable no-console */
import { datadogLogs, Logger } from '@datadog/browser-logs';
import { isString } from 'lodash';
import moment from 'moment';

export enum LogLevel {
  debug = 0,
  info = 1,
  log = 2,
  warn = 3,
  error = 4,
  silent = 5,
}

export interface ILogger {
  debug: (message: string, ...args: unknown[]) => void;
  error: (message: string | Error, ...args: unknown[]) => void;
  info: (message: string, ...args: unknown[]) => void;
  log: (message: string, ...args: unknown[]) => void;
  warn: (message: string, ...args: unknown[]) => void;
}

export class DataDogLogger implements ILogger {
  private remoteLogger?: Logger;

  // eslint-disable-next-line class-methods-use-this
  private get prefix(): string {
    const now = moment().utc();
    return now.format('(HH:mm:ss.SSS)');
  }

  constructor(
    private datadogToken: string,
    private env: string,
    private service: string,
    private extraParams?: Record<string, unknown>,
    private logLevel = LogLevel.error,
    private logLocal = false,
    private logTest = false,
    private site = 'datadoghq.com',
  ) {
    if ((env.toLowerCase() !== 'local' || this.logLocal) && (env.toLowerCase() !== 'test' || this.logTest)) {
      datadogLogs.init({
        clientToken: this.datadogToken,
        env: this.env,
        sampleRate: 100,
        site: this.site,
      });
      this.remoteLogger = datadogLogs.logger;
      this.remoteLogger?.addContext('service', this.service);
      if (this.extraParams) {
        Object.keys(this.extraParams).forEach(param => {
          this.remoteLogger?.addContext(param, (this.extraParams as Record<string, unknown>)[param]);
        });
      }
    }
  }

  public debug(message: string, ...args: unknown[]): void {
    if (this.logLevel <= LogLevel.debug && this.remoteLogger) {
      this.remoteLogger.debug(`${this.prefix} ${message}`, { args });
    } else {
      console.debug(message, ...args);
    }
  }

  public error<T extends Error>(message: string | T, ...args: unknown[]): void {
    if (this.logLevel <= LogLevel.error && this.remoteLogger) {
      this.remoteLogger.error(`${this.prefix} ${isString(message) ? message : message.message}`, { args });
    } else {
      console.error(message, ...args);
    }
  }

  public info(message: string, ...args: unknown[]): void {
    if (this.logLevel <= LogLevel.info && this.remoteLogger) {
      this.remoteLogger.info(`${this.prefix} ${message}`, { args });
    } else {
      console.info(message, ...args);
    }
  }

  public log(message: string, ...args: unknown[]): void {
    if (this.logLevel <= LogLevel.log && this.remoteLogger) {
      this.remoteLogger.log(`${this.prefix} ${message}`, { args });
    } else {
      console.log(message, ...args);
    }
  }

  public warn(message: string, ...args: unknown[]): void {
    if (this.logLevel <= LogLevel.warn && this.remoteLogger) {
      this.remoteLogger.warn(`${this.prefix} ${message}`, { args });
    } else {
      console.warn(message, ...args);
    }
  }
}
