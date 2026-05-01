/**
 * Jest configuration for an ES Module project (package.json "type": "module").
 * Uses Node's experimental VM modules so Jest can handle native ESM imports.
 *
 * Run tests with:
 *   npm test
 * which maps to:
 *   node --experimental-vm-modules node_modules/jest/bin/jest.js --verbose
 */
export default {
  // Use the Node test environment (no browser globals)
  testEnvironment: "node",

  // Clear mock calls/instances between every test automatically
  clearMocks: true,

  // Match both unit tests and integration tests
  testMatch: [
    "**/tests/**/*.test.js",
    "**/tests/**/*.integration.test.js",
  ],

  // Longer timeout for integration tests that hit a real DB
  testTimeout: 30000,

  // Verbose output so each test case is listed in the CI log
  verbose: true,
};
