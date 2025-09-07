import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AppError } from '@/errors/app.error';
import Logger from '@/loaders/logger';
import { ErrorResponse } from '@/dtos/common';

const errorHandler: ErrorRequestHandler = (
  err,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let appError: AppError;

  if (err instanceof AppError) {
    appError = err;
  } else if (err instanceof Error) {
    appError = new AppError(
      'Common.InternalError',
      `Unexpected Server Error: ${err.message}`
    );
    appError.stack = err.stack;
  } else {
    const syntheticError = new Error(
      typeof err === 'string' ? err : JSON.stringify(err)
    );
    appError = new AppError(
      'Common.InternalError',
      `Unexpected Server Error: ${syntheticError.message}`
    );
    appError.stack = syntheticError.stack;
  }

  if (process.env.NODE_ENV === 'development') {
    Logger.error('❌ [ERROR]', {
      code: appError.code,
      status: appError.statusCode,
      message: appError.message,
      details: appError.details,
      stack: appError.stack,
    });
  } else {
    Logger.error(`[${appError.code}] ${appError.message}`);
  }

  return res
    .status(appError.statusCode)
    .json(ErrorResponse.fromAppError(appError));
};

export default errorHandler;
