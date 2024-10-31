/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  transform: {
    '^.+.ts?$': ['ts-jest', 'babel-jest', {}],
  },
  transformIgnorePatterns: ['/node_modules/(?!(didcomm)/)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
