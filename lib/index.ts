/* istanbul ignore file */
import { Logger } from './LoggerCore';
import ConsoleLogger from './middlewares/consoleLogger';
import DatadogLogger from './middlewares/datadogLogger';

export type { ILoggerMiddleware, LogLevel } from './types';

export { ConsoleLogger, DatadogLogger, Logger };
