import { ResourceType } from '@/enums';

/**
 * Mock resource data generator
 */
export const createMockResource = (overrides = {}) => ({
  id: 'mock-resource-id',
  name: 'Mock Resource',
  type: ResourceType.A,
  data: { key: 'value' },
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

/**
 * Mock resource list generator
 */
export const createMockResourceList = (count = 3) => {
  return Array.from({ length: count }, (_, index) =>
    createMockResource({
      id: `mock-resource-id-${index + 1}`,
      name: `Mock Resource ${index + 1}`,
      type: index % 2 === 0 ? ResourceType.A : ResourceType.B,
    }),
  );
};

/**
 * Mock error factory
 */
export const createMockError = (status = 500, message = 'Mock Error', errors = []) => ({
  status,
  message,
  errors,
});