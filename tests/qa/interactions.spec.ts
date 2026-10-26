import { test } from '../fixtures';
import { getUrl, testConfig } from '../../config';

test.describe('DemoQA Interactions pages', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(getUrl(testConfig.pages.interactions.droppable), {
      waitUntil: 'domcontentloaded',
    });
  });

  test('dropping an item updates the drop target', async ({ demoQA }) => {
    await test.step('1. Drag the item to the drop target', async () => {
      await demoQA.droppablePage.dropItem();
    });

    await test.step('2. Verify the drop target shows the success message', async () => {
      await demoQA.droppablePage.verify.targetContains('Dropped!');
    });
  });
});