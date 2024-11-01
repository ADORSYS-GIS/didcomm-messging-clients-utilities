/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: 'node',
  roots: ['<rootDir>/src/tests'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  transform: {
    '^.+\\.ts$': ['ts-jest', {}],
  },
  testMatch: ["<rootDir>/src/tests/**/*.test.ts"], // Adjust based on your test naming
};
