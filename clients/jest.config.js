module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    globals: {
      'ts-jest': {
        diagnostics: false,
        tsconfig: "tsconfig.json",  // Ensure this points to your TypeScript config
        isolatedModules: true,
      },
    },
  };
  