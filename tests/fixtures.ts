import { test as base } from '@playwright/test';
import { DemoQA } from '../page-model/demoQA';
import { getUrl, testConfig } from '../config';

/**
 * Playwright fixture extending base test with demoQA page model facade
 */
export const test = base.extend<{ demoQA: DemoQA }>({
  demoQA: async ({ page, browser }, use) => {
    const demoQA = new DemoQA(page, browser);
    await use(demoQA);
  },
});

test.beforeEach(async ({ page }) => {
  await page.goto(getUrl(testConfig.pages.elements), { waitUntil: 'domcontentloaded' });
});

export { expect } from '@playwright/test';
