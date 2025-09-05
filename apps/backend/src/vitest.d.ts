/// <reference types="vitest/globals" />

import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

declare global {
  const describe: typeof import('vitest').describe;
  const it: typeof import('vitest').it;
  const test: typeof import('vitest').test;
  const expect: typeof import('vitest').expect;
  const beforeEach: typeof import('vitest').beforeEach;
  const afterEach: typeof import('vitest').afterEach;
  const beforeAll: typeof import('vitest').beforeAll;
  const afterAll: typeof import('vitest').afterAll;
  const vi: typeof import('vitest').vi;
}

declare module 'vitest' {
  interface Assertion<T = any>
    extends jest.Matchers<void, T>,
      TestingLibraryMatchers<T, void> {}
  interface AsymmetricMatchersContaining
    extends jest.Matchers<void, any>,
      TestingLibraryMatchers<any, void> {}
}
