# Testing Guide

## Overview

This directory contains tests for the application, organized into the following structure:

```
test/
├── unit/            # Unit tests for individual components
│   ├── services/    # Tests for service layer
│   └── repositories/ # Tests for repository layer
├── integration/     # Integration tests
│   └── api/         # Tests for API endpoints
└── setup.ts        # Common test setup and mocks
```

## Running Tests

To run all tests:

```bash
npm test
```

To run tests with coverage report:

```bash
npm test -- --coverage
```

To run specific test files:

```bash
npm test -- test/unit/services/resource.service.test.ts
```

## Test Types

### Unit Tests

Unit tests focus on testing individual components in isolation. Dependencies are mocked to ensure we're only testing the component itself.

- **Services**: Tests business logic without actual database operations
- **Repositories**: Tests data access logic with mocked database interactions

### Integration Tests

Integration tests verify that different components work together correctly.

- **API Tests**: Test API endpoints with mocked services to verify request/response handling

## Mocking Strategy

We use Jest's mocking capabilities to isolate components during testing:

- **Dependency Injection**: We leverage TypeDI to inject mocked dependencies
- **Database**: Mongoose models are mocked to avoid actual database connections
- **External Services**: Any external services are mocked

## Test Coverage

We aim for at least 70% test coverage across the codebase. Coverage reports are generated in the `coverage/` directory.