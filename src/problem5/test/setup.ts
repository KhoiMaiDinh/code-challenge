import 'reflect-metadata';
import { Container } from 'typedi';

// Mock mongoose to avoid actual database connections
jest.mock('mongoose', () => {
  const originalModule = jest.requireActual('mongoose');
  return {
    ...originalModule,
    connect: jest.fn().mockResolvedValue(undefined),
    connection: {
      on: jest.fn(),
      once: jest.fn(),
    },
  };
});

// Mock the logger to avoid console output during tests
jest.mock('@/loaders/logger', () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));

// Reset the container before each test
beforeEach(() => {
  Container.reset();
});