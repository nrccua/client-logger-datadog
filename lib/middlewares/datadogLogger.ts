import { datadogLogs, Logger } from '@datadog/browser-logs';
import { isUndefined } from 'lodash';

import { ILoggerMiddleware, LogLevel, LogLevelStrings } from '../types';

export interface IDatadogLoggerConfig {
  logLevel: LogLevel;
  /**
   * datadog site for the organization, will be 'datadoghq.com' by default
   */
  site: string;
  /**
   * Context key value pairs to be added to the logger
   * https://docs.datadoghq.com/logs/log_collection/javascript/#logger-context
   */
  extraContexts: Record<string, unknown>;
  /**
   * By default, no connection will be made if NODE_ENV is 'local' 'local-dev' or 'test'.
   * If there are additional environments to avoid remote logging, you can specify them here.
   */
  customIgnoredEnvironments: Array<string>;
}

const defaultDatadogLoggerConfig = {
  customIgnoredEnvironments: [],
  extraContexts: {},
  logLevel: LogLevel.error,
  site: 'datadoghq.com',
};

export default class DatadogLogger implements ILoggerMiddleware {
  private remoteLogger?: Logger;

  private config: IDatadogLoggerConfig;

  constructor(
    private service: string,
    private env: string,
    private datadogToken: string | undefined,
    private customConfig: Partial<IDatadogLoggerConfig> = {},
  ) {
    // // override possible missing config keys with default values
    this.config = { ...defaultDatadogLoggerConfig, ...this.customConfig };

    if (!isUndefined(this.datadogToken) && this.isRemoteEnvironment()) {
      datadogLogs.init({
        clientToken: this.datadogToken,
        env: this.env,
        forwardErrorsToLogs: false,
        sampleRate: 100,
        service,
        site: this.config.site,
      });

      const remoteLogger = datadogLogs.logger;
      remoteLogger?.addContext('service', this.service);

      Object.keys(this.config.extraContexts).forEach(param => {
        remoteLogger?.addContext(param, this.config.extraContexts[param]);
      });

      this.remoteLogger = remoteLogger;
    }
  }

  private isRemoteEnvironment(): boolean {
    const localEnvironments = ['local', 'local-dev', 'test', ...this.config.customIgnoredEnvironments];

    return !localEnvironments.some(envValue => envValue === this.env);
  }

  public onLog(level: LogLevelStrings, message: string, ...args: unknown[]): void {
    const logLevelValue = LogLevel[level];

    if (this.remoteLogger && this.config.logLevel <= logLevelValue) {
      this.remoteLogger[level](message, args);
    }
  }
}
