import { test } from '../fixtures';

test.describe('DemoQA Alerts page', () => {
  test.beforeEach(async ({ demoQA }) => {
    await demoQA.alertsPage.open();
  });

  test('accepting a confirmation dialog displays the accepted result', async ({ demoQA }) => {
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