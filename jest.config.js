module.exports = {
  preset: 'jest-preset-angular',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  setupFiles: ["<rootDir>/jest.setup.js"],
  transformIgnorePatterns: [
    'node_modules/(?!.*\\.mjs$|jest-preset-angular|@angular|@rxjs|tslib|@firebase|firebase|@ngrx|@ngx-translate|your-failing-package-name)'
  ],
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular', // Using the preset wrapper instead of raw 'ts-jest' ensures ESM compatibility
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.html$'
      }
    ]
  },
  moduleFileExtensions: ['ts', 'html', 'js', 'mjs', 'json'],
  testMatch: ['**/+(*.)+(spec|test).+(ts)']
};
