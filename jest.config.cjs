module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.js'],
  testMatch: ['<rootDir>/src/tests/**/*.test.(js|jsx)'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/src/tests/styleMock.cjs',
    '^@/(.*)$': '<rootDir>/$1',
  },
};
