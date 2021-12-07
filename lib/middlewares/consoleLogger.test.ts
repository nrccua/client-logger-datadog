import ConsoleLogger from './consoleLogger';

describe('Console logger middleware', (): void => {
  const consoleLoggerMiddleware = new ConsoleLogger();
  const dummyMessage = 'this is a dummy message';

  const globalConsole = { ...global.console };
  const consoleStub = {
    ...globalConsole,
    debug: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  };

  global.console = consoleStub;

  afterAll(() => {
    global.console = globalConsole;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    global.console = consoleStub;
  });

  it('calls the correct console method given the log level', () => {
    consoleLoggerMiddleware.onLog('debug', dummyMessage, 'some string value', { foo: 'bar' });
    expect(consoleStub.debug).toHaveBeenLastCalledWith(dummyMessage, 'some string value', { foo: 'bar' });

    consoleLoggerMiddleware.onLog('error', dummyMessage);
    expect(consoleStub.error).toHaveBeenLastCalledWith(dummyMessage);

    consoleLoggerMiddleware.onLog('info', dummyMessage, { userUid: 'uid' });
    expect(consoleStub.info).toHaveBeenLastCalledWith(dummyMessage, { userUid: 'uid' });

    consoleLoggerMiddleware.onLog('warn', dummyMessage);
    expect(consoleStub.warn).toHaveBeenLastCalledWith(dummyMessage);
  });
});
