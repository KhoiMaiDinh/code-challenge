import { Exclude, Expose, Type } from 'class-transformer';

import { serialize, serializeArray } from '@/utils/serializer.util';

// Create test classes for serialization
@Exclude()
class NestedDTO {
  @Expose()
  id: string;
  @Expose()
  value: number;
}

@Exclude()
class TestDTO {
  @Expose()
  id: string;
  @Expose()
  name: string;
  @Expose()
  @Type(() => NestedDTO)
  nested: NestedDTO;
}

describe('Serializer Utility', () => {
  it('should serialize a single object', () => {
    // Arrange
    const data = {
      id: '123',
      name: 'Test',
      extra: 'This should be excluded',
    };

    // Act
    const result = serialize(TestDTO, data);

    // Assert
    expect(result).toHaveProperty('id', '123');
    expect(result).toHaveProperty('name', 'Test');
    expect(result).not.toHaveProperty('extra');
  });

  it('should serialize an array of objects', () => {
    // Arrange
    const data = [
      {
        id: '123',
        name: 'Test 1',
        extra: 'This should be excluded',
      },
      {
        id: '456',
        name: 'Test 2',
        extra: 'This should also be excluded',
      },
    ];

    // Act
    const result = serializeArray(TestDTO, data);

    // Assert
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);
    expect(result[0]).toHaveProperty('id', '123');
    expect(result[0]).toHaveProperty('name', 'Test 1');
    expect(result[0]).not.toHaveProperty('extra');
    expect(result[1]).toHaveProperty('id', '456');
    expect(result[1]).toHaveProperty('name', 'Test 2');
    expect(result[1]).not.toHaveProperty('extra');
  });

  it('should handle not an array input', () => {
    // Act
    const result = serializeArray(TestDTO, {} as any);

    // Assert
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  it('should handle nested objects', () => {
    // Arrange
    const data = {
      id: '123',
      name: 'Test',
      nested: {
        id: '456',
        value: 42,
        extra: 'This should be excluded',
      },
    };

    // Act
    const result = serialize(TestDTO, data);

    // Assert
    expect(result).toHaveProperty('id', '123');
    expect(result).toHaveProperty('name', 'Test');
    expect(result).toHaveProperty('nested');
    expect(result.nested).toHaveProperty('id', '456');
    expect(result.nested).toHaveProperty('value', 42);
    expect(result.nested).not.toHaveProperty('extra');
  });

  it('should return null for null input', () => {
    // Act
    const result = serialize(TestDTO, null);

    // Assert
    expect(result).toEqual({});
  });

  it('should return undefined for undefined input', () => {
    // Act
    const result = serialize(TestDTO, undefined);
    // Assert
    expect(result).toEqual({});
  });
});
