import winston from 'winston';

import config from '@/config';

const transports = [];
if (process.env.NODE_ENV !== 'development') {
  transports.push(new winston.transports.Console());
} else {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }), // <-- Captures stack traces
        winston.format.printf(
          ({ timestamp, level, message, stack, ...meta }) => {
            // If we have an error stack, show it nicely
            if (stack) {
              return `[${timestamp}] ${level}: ${message}\n${stack}`;
            }
            // Otherwise, just show the message + metadata if any
            const metaString = Object.keys(meta).length
              ? ` ${JSON.stringify(meta, null, 2)}`
              : '';
            return `[${timestamp}] ${level}: ${message}${metaString}`;
          }
        )
      ),
    })
  );
}

const log = winston.createLogger({
  level: config.logs.level,
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports,
});

export default log;
