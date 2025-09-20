module.exports = {
  setupFiles: ['dotenv/config'],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    'next/cache': '<rootDir>/__mocks__/next/cache.ts',
    '@/lib/supabase': '<rootDir>/__mocks__/lib/supabase.ts',
  },
  transform: {
    '^.+\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
};