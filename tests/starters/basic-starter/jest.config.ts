import nextJest from 'next/jest';
import type { Config } from '@jest/types';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './starters/basic-starter',
});

// Add any custom config to be passed to Jest
const customJestConfig: Config.InitialOptions = {
  setupFilesAfterEnv: [__dirname + '/jest.setup.ts'],
  rootDir: '../../../starters/basic-starter',
  roots: [__dirname],
  modulePaths: ['<rootDir>'],
  testEnvironment: 'jest-environment-jsdom',
  preset: 'ts-jest/presets/js-with-ts',
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
