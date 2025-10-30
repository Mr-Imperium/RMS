import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { server } from './mocks/server'; // Import the mock server

// Extend vitest's expect with jest-dom matchers
expect.extend(matchers);

// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Runs a cleanup after each test case (e.g., clearing jsdom)
afterEach(() => {
  cleanup();
  // Reset any request handlers that we may add during the tests,
  // so they don't affect other tests.
  server.resetHandlers();
});

// Clean up after the tests are finished.
afterAll(() => server.close());