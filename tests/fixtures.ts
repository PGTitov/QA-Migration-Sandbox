import { test as base } from '@playwright/test';
import { DemoQA } from '../page-model/demoQA';

/**
 * Playwright fixture extending base test with demoQA page model facade
 */
export const test = base.extend<{ demoQA: DemoQA }>({
  demoQA: async ({ page, browser }, use) => {
    const demoQA = new DemoQA(page, browser);
    await use(demoQA);
  },
});

export { expect } from '@playwright/test';
