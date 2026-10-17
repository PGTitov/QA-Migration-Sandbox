import { test } from '../fixtures';
import { getUrl, testConfig } from '../../config';

test.describe('DemoQA Auto Complete page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(getUrl(testConfig.pages.widgets.autoComplete), {
      waitUntil: 'domcontentloaded',
    });
  });

  test('selecting a suggestion sets the single-value field', async ({ demoQA }) => {
    await test.step('1. Select the Red suggestion', async () => {
      await demoQA.autoCompletePage.selectSingleOption('Red');
    });

    await test.step('2. Verify the selected value is Red', async () => {
      await demoQA.autoCompletePage.verify.singleValueIs('Red');
    });
  });
});