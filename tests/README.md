# Warehouse Management System Tests

This directory contains end-to-end tests for the Warehouse Management System using Playwright.

## Test Structure

- **warehouse-picking.spec.ts**: Tests the picking functionality
- **warehouse-packing.spec.ts**: Tests the packing functionality
- **navigation.spec.ts**: Tests navigation across different warehouse functions
- **helpers/**: Helper functions for test state management

## Running Tests

Run all tests:
```bash
./run-tests.sh
```

Run specific tests:
```bash
./run-tests.sh warehouse-picking
```

Run tests with UI:
```bash
./run-tests.sh --headless false
```

Run tests in debug mode:
```bash
./run-tests.sh --debug
```

## Test Data

Test data is stored in `tests/test-data/` and can be used across test runs.
