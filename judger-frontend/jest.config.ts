import nextJest from 'next/jest';

const createJestConfig = nextJest({
  dir: './', // 프로젝트 루트 디렉터리
});

const customJestConfig = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};

export default createJestConfig(customJestConfig);
