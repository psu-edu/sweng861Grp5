# Logger

The logger being used is Winston and leans on Morgan for the middleware http requests in express.

The logs are displayed in the console and also output to 2 files, one "all.log" for all log levels, and the second being the error log file.

Log rotation may be something we should consider in a future update as writing to large log files can cause issues.

## Using the logger

The logger is outside of the regular modules so that the application can use it anywhere. Below are some examples on how to use Winston.

```
logger.info("my message")
logger.warn("Not really an error but could be")
logger.error("my message or err")
logger.debug("helpful info for debugging")
```
