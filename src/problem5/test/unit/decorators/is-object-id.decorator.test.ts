import 'reflect-metadata';
import { IsObjectId } from '@/decorators';
import { validate } from 'class-validator';

class TestClass {
  @IsObjectId()
  id: string;
}

describe('IsObjectId Decorator', () => {
  it('should pass validation for valid MongoDB ObjectId', async () => {
    // Arrange
    const test = new TestClass();
    test.id = '507f1f77bcf86cd799439011'; // Valid MongoDB ObjectId format

    // Act
    const errors = await validate(test);

    // Assert
    expect(errors.length).toBe(0);
  });

  it('should fail validation for invalid MongoDB ObjectId', async () => {
    // Arrange
    const test = new TestClass();
    test.id = 'invalid-id'; // Invalid MongoDB ObjectId format

    // Act
    const errors = await validate(test);

    // Assert
    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toHaveProperty('isObjectId');
  });

  it('should fail validation for empty string', async () => {
    // Arrange
    const test = new TestClass();
    test.id = ''; // Empty string

    // Act
    const errors = await validate(test);

    // Assert
    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toHaveProperty('isObjectId');
  });

  it('should fail validation for null value', async () => {
    // Arrange
    const test = new TestClass();
    test.id = null;

    // Act
    const errors = await validate(test);

    // Assert
    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toHaveProperty('isObjectId');
  });
});
