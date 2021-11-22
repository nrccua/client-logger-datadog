import { datadogLogs } from '@datadog/browser-logs';

import { DataDogLogger, LogLevel } from '.';

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

// const mockMomentUtc = jest.fn<number, unknown[]>();
const mockMomentFormat = jest.fn<string, unknown[]>();
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
jest.mock('moment', () => () => ({
  utc: jest.fn().mockReturnValue({
    format: mockMomentFormat,
  }),
}));

describe('logger service', () => {
  let backupConsole: typeof console;
  const context = {
    a: true,
  };
  const timestamp = '(05:04:03.021)';

  const extraParams = {
    commit: 'abcdef123',
  };

  beforeEach(() => {
    backupConsole = global.console;

    global.console = {
      // eslint-disable-line no-global-assign
      ...backupConsole,
      debug: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      log: jest.fn(),
      warn: jest.fn(),
    };
    jest.resetAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call
    // mockMomentUtc.mockReturnValue(Date.UTC(2021, 1, 1, 5, 4, 3, 21));
    mockMomentFormat.mockReturnValue(timestamp);
  });

  afterEach(() => {
    console = backupConsole; // eslint-disable-line no-global-assign
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('debug with logLevel = debug', () => {
    const logger = new DataDogLogger('TOKEN', 'prod', 'dd_test', extraParams, LogLevel.debug);

    logger.debug('test');
    logger.debug('test', context);

    expect(console.debug).toHaveBeenCalledTimes(0); // eslint-disable-line no-console
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(datadogLogs.logger.addContext).toHaveBeenCalledTimes(2);
    expect((datadogLogs.logger.addContext as jest.Mock).mock.calls[0]).toEqual(['service', 'dd_test']);
    expect((datadogLogs.logger.addContext as jest.Mock).mock.calls[1]).toEqual(['commit', extraParams.commit]);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(datadogLogs.logger.debug).toHaveBeenCalledTimes(2);
    expect((datadogLogs.logger.debug as jest.Mock).mock.calls[0]).toEqual([`${timestamp} test`, { args: [] }]);
    expect((datadogLogs.logger.debug as jest.Mock).mock.calls[1]).toEqual([`${timestamp} test`, { args: [context] }]);
  });

  test('debug with logLevel > debug', () => {
    const logger = new DataDogLogger('TOKEN', 'prod', 'dd_test', extraParams, LogLevel.info);

    logger.debug('test');
    logger.debug('test', context);

    expect(console.debug).toHaveBeenCalledTimes(2); // eslint-disable-line no-console
    expect((console.debug as jest.Mock).mock.calls[0]).toEqual([`test`]); // eslint-disable-line no-console
    expect((console.debug as jest.Mock).mock.calls[1]).toEqual(['test', context]); // eslint-disable-line no-console
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(datadogLogs.logger.debug).toHaveBeenCalledTimes(0);
  });

  test('info with logLevel = info', () => {
    const logger = new DataDogLogger('TOKEN', 'prod', 'dd_test', extraParams, LogLevel.info);

    logger.info('test');
    logger.info('test', context);

    expect(console.info).toHaveBeenCalledTimes(0); // eslint-disable-line no-console
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(datadogLogs.logger.addContext).toHaveBeenCalledTimes(2);
    expect((datadogLogs.logger.addContext as jest.Mock).mock.calls[0]).toEqual(['service', 'dd_test']);
    expect((datadogLogs.logger.addContext as jest.Mock).mock.calls[1]).toEqual(['commit', extraParams.commit]);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(datadogLogs.logger.info).toHaveBeenCalledTimes(2);
    expect((datadogLogs.logger.info as jest.Mock).mock.calls[0]).toEqual([`${timestamp} test`, { args: [] }]);
    expect((datadogLogs.logger.info as jest.Mock).mock.calls[1]).toEqual([`${timestamp} test`, { args: [context] }]);
  });

  test('info with logLevel > info', () => {
    const logger = new DataDogLogger('TOKEN', 'prod', 'dd_test', extraParams, LogLevel.log);

    logger.info('test');
    logger.info('test', context);

    expect(console.info).toHaveBeenCalledTimes(2); // eslint-disable-line no-console
    expect((console.info as jest.Mock).mock.calls[0]).toEqual([`test`]); // eslint-disable-line no-console
    expect((console.info as jest.Mock).mock.calls[1]).toEqual(['test', context]); // eslint-disable-line no-console
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(datadogLogs.logger.info).toHaveBeenCalledTimes(0);
  });

  test('log with logLevel = log', () => {
    const logger = new DataDogLogger('TOKEN', 'prod', 'dd_test', extraParams, LogLevel.log);

    logger.log('test');
    logger.log('test', context);

    expect(console.log).toHaveBeenCalledTimes(0); // eslint-disable-line no-console
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(datadogLogs.logger.addContext).toHaveBeenCalledTimes(2);
    expect((datadogLogs.logger.addContext as jest.Mock).mock.calls[0]).toEqual(['service', 'dd_test']);
    expect((datadogLogs.logger.addContext as jest.Mock).mock.calls[1]).toEqual(['commit', extraParams.commit]);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(datadogLogs.logger.log).toHaveBeenCalledTimes(2);
    expect((datadogLogs.logger.log as jest.Mock).mock.calls[0]).toEqual([`${timestamp} test`, { args: [] }]);
    expect((datadogLogs.logger.log as jest.Mock).mock.calls[1]).toEqual([`${timestamp} test`, { args: [context] }]);
  });

  test('log with logLevel > log', () => {
    const logger = new DataDogLogger('TOKEN', 'prod', 'dd_test', extraParams, LogLevel.warn);

    logger.log('test');
    logger.log('test', context);

    expect(console.log).toHaveBeenCalledTimes(2); // eslint-disable-line no-console
    expect((console.log as jest.Mock).mock.calls[0]).toEqual([`test`]); // eslint-disable-line no-console
    expect((console.log as jest.Mock).mock.calls[1]).toEqual(['test', context]); // eslint-disable-line no-console
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(datadogLogs.logger.log).toHaveBeenCalledTimes(0);
  });

  test('warn with logLevel = warn', () => {
    const logger = new DataDogLogger('TOKEN', 'prod', 'dd_test', extraParams, LogLevel.warn);

    logger.warn('test');
    logger.warn('test', context);

    expect(console.warn).toHaveBeenCalledTimes(0); // eslint-disable-line no-console
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(datadogLogs.logger.addContext).toHaveBeenCalledTimes(2);
    expect((datadogLogs.logger.addContext as jest.Mock).mock.calls[0]).toEqual(['service', 'dd_test']);
    expect((datadogLogs.logger.addContext as jest.Mock).mock.calls[1]).toEqual(['commit', extraParams.commit]);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(datadogLogs.logger.warn).toHaveBeenCalledTimes(2);
    expect((datadogLogs.logger.warn as jest.Mock).mock.calls[0]).toEqual([`${timestamp} test`, { args: [] }]);
    expect((datadogLogs.logger.warn as jest.Mock).mock.calls[1]).toEqual([`${timestamp} test`, { args: [context] }]);
  });

  test('warn with logLevel > warn', () => {
    const logger = new DataDogLogger('TOKEN', 'prod', 'dd_test', extraParams, LogLevel.error);

    logger.warn('test');
    logger.warn('test', context);

    expect(console.warn).toHaveBeenCalledTimes(2); // eslint-disable-line no-console
    expect((console.warn as jest.Mock).mock.calls[0]).toEqual([`test`]); // eslint-disable-line no-console
    expect((console.warn as jest.Mock).mock.calls[1]).toEqual(['test', context]); // eslint-disable-line no-console
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(datadogLogs.logger.warn).toHaveBeenCalledTimes(0);
  });

  test('error with logLevel = error', () => {
    const logger = new DataDogLogger('TOKEN', 'prod', 'dd_test', extraParams);

    logger.error('test');
    logger.error('test', context);

    expect(console.error).toHaveBeenCalledTimes(0); // eslint-disable-line no-console
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(datadogLogs.logger.addContext).toHaveBeenCalledTimes(2);
    expect((datadogLogs.logger.addContext as jest.Mock).mock.calls[0]).toEqual(['service', 'dd_test']);
    expect((datadogLogs.logger.addContext as jest.Mock).mock.calls[1]).toEqual(['commit', extraParams.commit]);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(datadogLogs.logger.error).toHaveBeenCalledTimes(2);
    expect((datadogLogs.logger.error as jest.Mock).mock.calls[0]).toEqual([`${timestamp} test`, { args: [] }]);
    expect((datadogLogs.logger.error as jest.Mock).mock.calls[1]).toEqual([`${timestamp} test`, { args: [context] }]);
  });

  test('error with logLevel = error + Error object', () => {
    const logger = new DataDogLogger('TOKEN', 'prod', 'dd_test', extraParams);

    logger.error(new Error('test'));
    logger.error(new Error('test'), context);

    expect(console.error).toHaveBeenCalledTimes(0); // eslint-disable-line no-console
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(datadogLogs.logger.addContext).toHaveBeenCalledTimes(2);
    expect((datadogLogs.logger.addContext as jest.Mock).mock.calls[0]).toEqual(['service', 'dd_test']);
    expect((datadogLogs.logger.addContext as jest.Mock).mock.calls[1]).toEqual(['commit', extraParams.commit]);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(datadogLogs.logger.error).toHaveBeenCalledTimes(2);
    expect((datadogLogs.logger.error as jest.Mock).mock.calls[0]).toEqual([`${timestamp} test`, { args: [] }]);
    expect((datadogLogs.logger.error as jest.Mock).mock.calls[1]).toEqual([`${timestamp} test`, { args: [context] }]);
  });

  test('error with logLevel > error', () => {
    const logger = new DataDogLogger('TOKEN', 'prod', 'dd_test', extraParams, LogLevel.silent);

    logger.error('test');
    logger.error('test', context);

    expect(console.error).toHaveBeenCalledTimes(2); // eslint-disable-line no-console
    expect((console.error as jest.Mock).mock.calls[0]).toEqual([`test`]); // eslint-disable-line no-console
    expect((console.error as jest.Mock).mock.calls[1]).toEqual(['test', context]); // eslint-disable-line no-console
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(datadogLogs.logger.error).toHaveBeenCalledTimes(0);
  });

  test('error with no extraParams', () => {
    const logger = new DataDogLogger('TOKEN', 'prod', 'dd_test');

    logger.error('test');
    logger.error('test', context);

    expect(console.error).toHaveBeenCalledTimes(0); // eslint-disable-line no-console
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(datadogLogs.logger.addContext).toHaveBeenCalledTimes(1);
    expect((datadogLogs.logger.addContext as jest.Mock).mock.calls[0]).toEqual(['service', 'dd_test']);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(datadogLogs.logger.error).toHaveBeenCalledTimes(2);
    expect((datadogLogs.logger.error as jest.Mock).mock.calls[0]).toEqual([`${timestamp} test`, { args: [] }]);
    expect((datadogLogs.logger.error as jest.Mock).mock.calls[1]).toEqual([`${timestamp} test`, { args: [context] }]);
  });

  test('error with logLocal = true', () => {
    const logger = new DataDogLogger('TOKEN', 'local', 'dd_test', extraParams, LogLevel.error, true);

    logger.error('test');
    logger.error('test', context);

    expect(console.error).toHaveBeenCalledTimes(0); // eslint-disable-line no-console
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(datadogLogs.logger.error).toHaveBeenCalledTimes(2);
    expect((datadogLogs.logger.error as jest.Mock).mock.calls[0]).toEqual([`${timestamp} test`, { args: [] }]);
    expect((datadogLogs.logger.error as jest.Mock).mock.calls[1]).toEqual([`${timestamp} test`, { args: [context] }]);
  });

  test('error with logTest = true', () => {
    const logger = new DataDogLogger('TOKEN', 'test', 'dd_test', extraParams, LogLevel.error, false, true);

    logger.error('test');
    logger.error('test', context);

    expect(console.error).toHaveBeenCalledTimes(0); // eslint-disable-line no-console
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(datadogLogs.logger.error).toHaveBeenCalledTimes(2);
    expect((datadogLogs.logger.error as jest.Mock).mock.calls[0]).toEqual([`${timestamp} test`, { args: [] }]);
    expect((datadogLogs.logger.error as jest.Mock).mock.calls[1]).toEqual([`${timestamp} test`, { args: [context] }]);
  });
});
