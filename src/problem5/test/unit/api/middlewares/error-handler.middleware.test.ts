import request from 'supertest';
import express from 'express';

import { errorHandler } from '@/api/middlewares';
import Logger from '@/loaders/logger';
import { ErrorResponse } from '@/dtos/common';
import { Errors } from '@/errors/factory';

// Mock Logger & ErrorResponse
jest.mock('@/loaders/logger', () => ({
  error: jest.fn(),
  debug: jest.fn(),
}));

jest.mock('@/dtos/common', () => ({
  ErrorResponse: {
    fromAppError: jest.fn().mockImplementation((appError) => ({
      code: appError.code,
      message: appError.message,
      statusCode: appError.statusCode,
    })),
  },
}));

// Helper function to create an Express app with error handler
const createApp = () => {
  const app = express();
  app.get('/throw-app-error', (_req, _res, next) => {
    next(Errors.Resource.NotFound({ id: '1' }));
  });

  app.get('/throw-generic-error', (_req, _res, next) => {
    next(new Error('Something bad happened'));
  });

  app.get('/throw-string-error', (_req, _res, next) => {
    next('String error occurred');
  });

  app.get('/throw-non-string-error', (_req, _res, next) => {
    next(123);
  });

  app.use(errorHandler);
  return app;
};

describe('errorHandler middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when err is AppError', () => {
    it('should return correct status and message', async () => {
      const app = createApp();
      const res = await request(app).get('/throw-app-error');

      console.log(res.body);
      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        code: 'Resource.NotFound',
        message: 'Resource not found',
        statusCode: 404,
      } as ErrorResponse);

      expect(ErrorResponse.fromAppError).toHaveBeenCalled();
      expect(Logger.error).toHaveBeenCalled();
    });
  });

  describe('when err is a generic Error', () => {
    it('should wrap error into AppError and return 500', async () => {
      const app = createApp();
      const res = await request(app).get('/throw-generic-error');

      expect(res.status).toBe(500);
      expect(res.body.code).toBe('Common.InternalError');
      expect(res.body.message).toContain('Unexpected Server Error');
      expect(ErrorResponse.fromAppError).toHaveBeenCalled();
      expect(Logger.error).toHaveBeenCalled();
    });
  });

  describe('when err is a string', () => {
    it('should convert string into synthetic Error', async () => {
      const app = createApp();
      const res = await request(app).get('/throw-string-error');

      expect(res.status).toBe(500);
      expect(res.body.code).toBe('Common.InternalError');
      expect(res.body.message).toContain('Unexpected Server Error');
      expect(ErrorResponse.fromAppError).toHaveBeenCalled();
      expect(Logger.error).toHaveBeenCalled();
    });
  });

  describe('when err is a non-string', () => {
    it('should convert non-string into synthetic Error', async () => {
      const app = createApp();
      const res = await request(app).get('/throw-non-string-error');

      expect(res.status).toBe(500);
      expect(res.body.code).toBe('Common.InternalError');
      expect(res.body.message).toContain('Unexpected Server Error');
      expect(ErrorResponse.fromAppError).toHaveBeenCalled();
      expect(Logger.error).toHaveBeenCalled();
    });
  });

  describe('logger behavior', () => {
    it('should log detailed error info in development', async () => {
      process.env.NODE_ENV = 'development';
      const app = createApp();
      await request(app).get('/throw-generic-error');

      expect(Logger.error).toHaveBeenCalledWith(
        '❌ [ERROR]',
        expect.any(Object)
      );
    });

    it('should log minimal error info in production', async () => {
      process.env.NODE_ENV = 'production';
      const app = createApp();
      await request(app).get('/throw-generic-error');

      expect(Logger.error).toHaveBeenCalledWith(
        expect.stringContaining('[Common.InternalError]')
      );
    });
  });
});
