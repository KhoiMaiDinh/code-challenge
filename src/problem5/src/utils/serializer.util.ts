import { ClassConstructor, plainToInstance } from 'class-transformer';

export function serialize<T>(dto: ClassConstructor<T>, data: unknown): T {
  if (typeof data !== 'object' || data === null || data === undefined) {
    return {} as T;
  }

  return plainToInstance(dto, data, {
    excludeExtraneousValues: true,
  });
}

export function serializeArray<T>(
  dto: ClassConstructor<T>,
  data: unknown[]
): T[] {
  if (!Array.isArray(data)) {
    return [];
  }
  return plainToInstance(dto, data, {
    excludeExtraneousValues: true,
  });
}
