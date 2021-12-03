// this also covers tests for LoggerInstance
import { LoggerCore } from './index';

describe('Console logger middleware', (): void => {
  const dummyMessage = 'this is a dummy message';
  const moduleName = 'test module';
  const dummyLoggerMiddleware = {
    onLog: jest.fn(),
  };

  // attach middlewares to core logger
  const loggerCore = new LoggerCore();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const dummyMiddlewares = [...Array(3)].map(() => dummyLoggerMiddleware);

  dummyMiddlewares.forEach(middleware => {
    loggerCore.addMiddleware(middleware);
  });

  // make moment use mocked date now
  Date.now = jest.fn().mockReturnValue(new Date('2020-05-13T12:33:37.000Z'));
  const timestamp = '(2020-05-13T12:33:37.000)';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls each middleware for any of the log methods', () => {
    loggerCore.debug(moduleName, dummyMessage);

    dummyMiddlewares.forEach(middleware => {
      expect(middleware.onLog).toHaveBeenLastCalledWith('debug', moduleName, dummyMessage);
    });

    loggerCore.log(moduleName, dummyMessage);

    dummyMiddlewares.forEach(middleware => {
      expect(middleware.onLog).toHaveBeenLastCalledWith('log', moduleName, dummyMessage);
    });

    loggerCore.info(moduleName, dummyMessage);

    dummyMiddlewares.forEach(middleware => {
      expect(middleware.onLog).toHaveBeenLastCalledWith('info', moduleName, dummyMessage);
    });

    loggerCore.warn(moduleName, dummyMessage);

    dummyMiddlewares.forEach(middleware => {
      expect(middleware.onLog).toHaveBeenLastCalledWith('warn', moduleName, dummyMessage);
    });

    loggerCore.error(moduleName, dummyMessage);

    dummyMiddlewares.forEach(middleware => {
      expect(middleware.onLog).toHaveBeenLastCalledWith('error', moduleName, dummyMessage);
    });
  });

  it('getLogger returns a valid logger that calls core middlewares with prefix', () => {
    const diffModuleName = 'my-module';
    const logger = loggerCore.getLogger(diffModuleName);

    const expectedMessageFormat = `${timestamp} [${diffModuleName}] ${dummyMessage}`;

    logger.debug(dummyMessage);

    dummyMiddlewares.forEach(middleware => {
      expect(middleware.onLog).toHaveBeenLastCalledWith('debug', diffModuleName, expectedMessageFormat);
    });

    logger.log(dummyMessage);

    dummyMiddlewares.forEach(middleware => {
      expect(middleware.onLog).toHaveBeenLastCalledWith('log', diffModuleName, expectedMessageFormat);
    });

    logger.info(dummyMessage);

    dummyMiddlewares.forEach(middleware => {
      expect(middleware.onLog).toHaveBeenLastCalledWith('info', diffModuleName, expectedMessageFormat);
    });

    logger.warn(dummyMessage);

    dummyMiddlewares.forEach(middleware => {
      expect(middleware.onLog).toHaveBeenLastCalledWith('warn', diffModuleName, expectedMessageFormat);
    });

    logger.error(dummyMessage);

    dummyMiddlewares.forEach(middleware => {
      expect(middleware.onLog).toHaveBeenLastCalledWith('error', diffModuleName, expectedMessageFormat);
    });
  });
});
