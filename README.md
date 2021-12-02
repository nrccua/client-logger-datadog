# Client Logger Datadog

A library that creates a logger with support for middlewares that will be called when a message is logged.
The library also exports some already built middlewares, such as DatadogLogger that connects with datadog and a ConsoleLogger middleware.

## Features

* Logger class that accepts middlewares to allow customization
* Automatically adds timestamp and module name prefix to the messages
* Typing information

## Usage

Import the `Logger` from the library and attach desired middlewares.

You can customize certain configurations by passing a config object
```TypeScript

// logger.ts
import { Logger, DatadogLogger, ConsoleLogger } from 'client-logger-datadog';

const consoleLogger = new ConsoleLogger();
const datadogLogger = new DatadogLogger('my-application', NODE_ENV, datadogKey);
Logger.addMiddleware(consoleLogger);
Logger.addMiddleware(datadogLogger);


// feature.ts

import { Logger } from './logger.ts';

const logger = Logger.getLogger('feature');

try {
  // will call the datadog logger and console logger middlewares
    logger.info('Requesting user auth', { user });
    //
} catch(e: unknown) {
    logger.error('error while requesting user authentication', { error, user });
    //
}

```

# DatadogLogger Middleware
The middleware creates a connection with datadog if the datadog configuration parameters are valid, and if `env` is any of `local` `local-dev` or `test`.
If there are additional environments that you want to ignore, you can specify a `customIgnoredEnvironments` array with environments to be ignored.

The remote logs will only be sent if they are equal or above the configured log level. i.e a log level of 1 (info) will send info, warn and error logs.
By default, the logger will only send remote logs of the error level (value of 3).

The middleware can be customized by an additional config parameter in the constructor, such as:

```TypeScript

// logger.ts
import { Logger, DatadogLogger, ConsoleLogger } from 'client-logger-datadog';

// examples of contexts you might want to attach to your logs
const currentCommit = getCurrentCommit();
const currentBuildTag = getCurrentBuildTag();

const loggerConfig = {
    logLevel: 2, // will send 'warn' and 'error' logs 
    site: 'company-name.te.st.com',
    extraContexts: {
        commit: currentCommit,
        buildTag: currentBuildTag,
    },
    customIgnoredEnvironments: ['local-development', 'dev-local', 'it-test'],
};

const datadogLogger = new DatadogLogger('my-application', NODE_ENV, datadogKey, loggerConfig);
```
# ConsoleLogger Middleware
The library exports a middleware that will call the browser console when a log is received. If you want your logs to also
go to the current client's browser console, you can use this middleware.
# Defining your own middleware
You can create your own middleware by extending the ILoggerMiddleware interface.

```TypeScript
  import { ILoggerMiddleware, Logger } from 'client-logger-datadog';

  class MyLoggerMiddleware extends ILoggerMiddleware {
    private remoteLogger;

    constructor(token: string) {
      remoteLogger = someLoggingService.init(token);
      // other configurations
    }

    public onLog(level: LogLevelStrings, message: string, ...args: unknown[]): void {
      if (remoteLogger) {
        this.remoteLogger[level](message, args);
      } else {
        // save logs to a file or some other logic
      }
    }
  }


  const myMiddleware = new MyLoggerMiddleware('secret-token');

  Logger.addMiddleware(myMiddleware);
```
## Releasing

Checking in the dist folder is not necessary as it will be built upon
npm install by the downstream project.

After making any changes and merging them to main, please do the following:

* Create a new branch from main and run `npm run update:version`
* Verify the `CHANGELOG.md` generated changes
* Commit, push, and merge to main.
* Create a new
  [release](https://github.com/nrccua/apollo-rest-utils/releases/new) using
  the tag generated in the previous steps
* Use the `Auto-generate release notes` button to generate the release notes,
  and add any context you may deem necessary.
