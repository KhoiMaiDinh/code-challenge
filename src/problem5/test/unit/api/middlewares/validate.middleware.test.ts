import { Response, NextFunction } from 'express';
import { IsString, IsNotEmpty } from 'class-validator';

import { validateDto } from '@/api/middlewares';
import { AppError } from '@/errors/app.error';
import { Request } from '@/types/express';

class TestDTO {
  @IsString()
  @IsNotEmpty()
  name: string;
}

describe('Validation Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      body: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  it('should call next() when validation passes', async () => {
    // Arrange
    mockRequest.body = { name: 'Valid Name' };
    const middleware = validateDto({ body: TestDTO });

    // Act
    await middleware(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    // Assert
    expect(mockNext).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });

  it('should return 422 when validation fails', async () => {
    mockRequest.body = { name: '' }; // invalid
    const middleware = validateDto({ body: TestDTO });

    await middleware(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledTimes(1);
    const err = (mockNext as jest.Mock).mock.calls[0][0];

    // Check that it's an AppError from Errors.Common.ValidationFailed
    expect(err).toBeInstanceOf(AppError);
    expect(err.code).toBe('Common.ValidationFailed');
    expect(err.details).toHaveProperty('violations');
    expect(err.details.violations[0]).toHaveProperty('field', 'name');
  });

  it('should handle query parameters validation', async () => {
    mockRequest.query = { name: 'Valid Name' };
    const middleware = validateDto({ query: TestDTO });

    await middleware(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockNext).toHaveBeenCalledWith();
  });

  it('should handle params validation', async () => {
    // Arrange
    mockRequest.params = { name: 'Valid Name' };
    const middleware = validateDto({ params: TestDTO });

    // Act
    await middleware(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    // Assert
    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockNext).toHaveBeenCalledWith();

    expect((mockRequest as Request).dtoParams).toBeInstanceOf(TestDTO);
    expect(
      (mockRequest as Request<undefined, TestDTO, undefined>).dtoParams.name
    ).toBe('Valid Name');
  });
});
