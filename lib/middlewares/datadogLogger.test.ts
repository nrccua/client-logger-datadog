/* eslint-disable @typescript-eslint/unbound-method */
// disabling due to typescript typescript getting the types from the datadogLogs instead of the jest mock
import { datadogLogs } from '@datadog/browser-logs';

import { LogLevel } from '../types';

import DatadogLogger from './datadogLogger';

jest.mock('@datadog/browser-logs', () => ({
  datadogLogs: {
    init: jest.fn(),
    logger: {
      addContext: jest.fn(),
      debug: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      log: jest.fn(),
      warn: jest.fn(),
    },
  },
}));

describe('Datadog logger middleware', (): void => {
  const datadogKey = 'dummy-dd-key';
  const service = 'dummy-service';
  const dummyMessage = 'this is a dummy message';

  let datadogLoggerMiddleware;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('connects with datadog given correct parameters and running on a remote environment', () => {
    const devEnv = 'development';
    datadogLoggerMiddleware = new DatadogLogger(service, devEnv, datadogKey);

    const expectedInitCall = {
      clientToken: datadogKey,
      env: devEnv,
      forwardErrorsToLogs: false,
      sampleRate: 100,
      service,
      site: 'datadoghq.com',
    };

    expect(datadogLogs.init).toHaveBeenCalledWith(expectedInitCall);
    expect(datadogLogs.logger.addContext).toHaveBeenLastCalledWith('service', service);
  });

  it('does not create remote logger if environment is not remote', () => {
    datadogLoggerMiddleware = new DatadogLogger(service, 'local', datadogKey);
    datadogLoggerMiddleware.onLog('error', dummyMessage);

    expect(datadogLogs.init).not.toHaveBeenCalled();
  });

  it('does not create remote logger if parameters are invalid', () => {
    datadogLoggerMiddleware = new DatadogLogger(service, 'local', undefined);
    datadogLoggerMiddleware.onLog('error', dummyMessage);

    expect(datadogLogs.init).not.toHaveBeenCalled();
  });

  it('sends logs to remote if configured logLevel is above the message log level', () => {
    datadogLoggerMiddleware = new DatadogLogger(service, 'development', datadogKey, { logLevel: LogLevel.warn });

    datadogLoggerMiddleware.onLog('debug', dummyMessage);
    expect(datadogLogs.logger.debug).not.toHaveBeenCalled();

    datadogLoggerMiddleware.onLog('info', dummyMessage);
    expect(datadogLogs.logger.info).not.toHaveBeenCalled();

    datadogLoggerMiddleware.onLog('warn', dummyMessage);
    expect(datadogLogs.logger.warn).toHaveBeenCalledWith(dummyMessage, []);

    datadogLoggerMiddleware.onLog('error', dummyMessage);
    expect(datadogLogs.logger.error).toHaveBeenCalledWith(dummyMessage, []);
  });

  it('adds extra context keys', () => {
    const config = {
      extraContexts: {
        'build-hash': 'aaaabbbbcccc444eee',
        'session-id': 'some-session-id',
      },
    };

    datadogLoggerMiddleware = new DatadogLogger(service, 'development', datadogKey, config);
    expect(datadogLogs.logger.addContext).toHaveBeenNthCalledWith(1, 'service', service);
    expect(datadogLogs.logger.addContext).toHaveBeenNthCalledWith(2, 'build-hash', 'aaaabbbbcccc444eee');
    expect(datadogLogs.logger.addContext).toHaveBeenNthCalledWith(3, 'session-id', 'some-session-id');
  });
});
