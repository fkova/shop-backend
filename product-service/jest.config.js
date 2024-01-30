module.exports = {
  preset: "ts-jest",
  moduleNameMapper: {
    '@libs/(.*)': '<rootDir>/src/libs/$1',
  },
  verbose: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testEnvironment: "node",
  testTimeout: 20000,
  transform: {
    "^.+\\.(ts|tsx|js)$": "ts-jest",
  },
};