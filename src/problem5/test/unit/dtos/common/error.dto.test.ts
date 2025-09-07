import { AppError } from '@/errors/app.error';
import ErrorResponse from '@/dtos/common/error.dto';

describe('ErrorResponse', () => {
  it('should include stack when NODE_ENV=development', () => {
    process.env.NODE_ENV = 'development';
    const appError = new AppError('Common.InternalError', 'Test message');

    const err = ErrorResponse.fromAppError(appError);

    expect(err.stack).toBeDefined();
  });

  it('should not include stack when NODE_ENV=production', () => {
    process.env.NODE_ENV = 'production';
    const appError = new AppError('Common.InternalError', 'Test message');

    const err = ErrorResponse.fromAppError(appError);

    expect(err.stack).toBeUndefined();
  });
});
