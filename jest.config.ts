import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  projects: ['<rootDir>', '<rootDir>/tests/starters/basic-starter'],
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/cypress/',
    '/dist/',
    '/.turbo/',
    '/.next/',
    '/tests/starters/',
  ],
};

export default config;
