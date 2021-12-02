import { datadogLogs, Logger } from '@datadog/browser-logs';
import { isString, isUndefined } from 'lodash';

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

  constructor(private service: string, private env: string, private datadogToken?: string, private config: IDatadogLoggerConfig = defaultDatadogLoggerConfig) {
    // // override possible missing config keys with default values
    const configToUse: IDatadogLoggerConfig = { ...defaultDatadogLoggerConfig, ...config };

    if (!isUndefined(this.datadogToken) && this.isRemoteEnvironment() && this.validateDDParams()) {
      datadogLogs.init({
        clientToken: this.datadogToken,
        env: this.env,
        sampleRate: 100,
        site: configToUse.site,
      });

      const remoteLogger = datadogLogs.logger;
      remoteLogger?.addContext('service', this.service);

      Object.keys(configToUse.extraContexts).forEach(param => {
        this.remoteLogger?.addContext(param, configToUse.extraContexts[param]);
      });

      this.remoteLogger = remoteLogger;
    }

    this.config = configToUse;
  }

  private validateDDParams(): boolean {
    return Boolean(isString(this.env) && isString(this.config.site) && isString(this.datadogToken));
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
