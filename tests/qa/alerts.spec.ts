import { test } from '../fixtures';
import { getUrl, testConfig } from '../../config';

test.describe('DemoQA Alerts page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(getUrl(testConfig.pages.alerts.alerts), {
      waitUntil: 'domcontentloaded',
    });
  });

  test('accepting a confirmation dialog displays the accepted result', async ({ demoQA, page }) => {
    await test.step('1. Trigger the confirmation dialog and accept it', async () => {
      const dialogHandled = demoQA.dialog.acceptNext({
        type: 'confirm',
        message: 'Do you confirm action?',
      });
      await demoQA.alertsPage.triggerConfirm();
      await dialogHandled;
    });

    await test.step('2. Verify the accepted result is shown', async () => {
      await demoQA.alertsPage.verify.confirmResultContains('You selected Ok');
    });
  });
});