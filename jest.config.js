/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  roots: ['<rootDir>/test'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  cache: false,
};
