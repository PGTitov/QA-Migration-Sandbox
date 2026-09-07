import { test, Authors, Priorities } from '../fixtures';
import { getUrl, testConfig } from '../../config';

test.describe('DemoQA Buttons page', () => {
  test(
    '[TEST-30] Verify a double click shows the double click message',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'TEST-30' },
        { type: 'priority', description: Priorities.Medium },
      ],
    },
    async ({ demoQA, page }) => {
      // #region Arrange
      await test.step('1. Navigate to the Buttons page', async () => {
        await page.goto(getUrl(testConfig.pages.buttons), {
          waitUntil: 'domcontentloaded',
        });
        await demoQA.buttonsPage.verify.noMessageShown();
      });
      // #endregion

      // #region Act
      await test.step('2. Double click the Double Click Me button', async () => {
        await demoQA.buttonsPage.performDoubleClick();
      });
      // #endregion

      // #region Assert
      await test.step('3. Verify the double click message is shown', async () => {
        await demoQA.buttonsPage.verify.actionMessageAppears();
        await demoQA.buttonsPage.verify.messageContains('You have done a double click');
      });
      // #endregion
    }
  );

  test(
    '[TEST-31] Verify a right click shows the right click message',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'TEST-31' },
        { type: 'priority', description: Priorities.Medium },
      ],
    },
    async ({ demoQA, page }) => {
      // #region Arrange
      await test.step('1. Navigate to the Buttons page', async () => {
        await page.goto(getUrl(testConfig.pages.buttons), {
          waitUntil: 'domcontentloaded',
        });
        await demoQA.buttonsPage.verify.noMessageShown();
      });
      // #endregion

      // #region Act
      await test.step('2. Right click the Right Click Me button', async () => {
        await demoQA.buttonsPage.performRightClick();
      });
      // #endregion

      // #region Assert
      await test.step('3. Verify the right click message is shown', async () => {
        await demoQA.buttonsPage.verify.actionMessageAppears();
        await demoQA.buttonsPage.verify.messageContains('You have done a right click');
      });
      // #endregion
    }
  );

  test(
    '[TEST-32] Verify a single click shows the dynamic click message',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'TEST-32' },
        { type: 'priority', description: Priorities.Medium },
      ],
    },
    async ({ demoQA, page }) => {
      // #region Arrange
      await test.step('1. Navigate to the Buttons page', async () => {
        await page.goto(getUrl(testConfig.pages.buttons), {
          waitUntil: 'domcontentloaded',
        });
        await demoQA.buttonsPage.verify.noMessageShown();
      });
      // #endregion

      // #region Act
      await test.step('2. Click the Click Me button', async () => {
        await demoQA.buttonsPage.performSingleClick();
      });
      // #endregion

      // #region Assert
      await test.step('3. Verify the dynamic click message is shown', async () => {
        await demoQA.buttonsPage.verify.actionMessageAppears();
        await demoQA.buttonsPage.verify.messageContains('You have done a dynamic click');
      });
      // #endregion
    }
  );

  test(
    '[TEST-33] Verify no message is shown before any button is clicked',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'TEST-33' },
        { type: 'priority', description: Priorities.Low },
      ],
    },
    async ({ demoQA, page }) => {
      // #region Arrange
      await test.step('1. Navigate to the Buttons page', async () => {
        await page.goto(getUrl(testConfig.pages.buttons), {
          waitUntil: 'domcontentloaded',
        });
      });
      // #endregion

      // #region Assert
      await test.step('2. Verify no action message is displayed', async () => {
        await demoQA.buttonsPage.verify.noMessageShown();
      });
      // #endregion
    }
  );

  test(
    '[TEST-34] Verify a plain click on the Double Click Me button does not show a message',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'TEST-34' },
        { type: 'priority', description: Priorities.Low },
      ],
    },
    async ({ demoQA, page }) => {
      // #region Arrange
      await test.step('1. Navigate to the Buttons page', async () => {
        await page.goto(getUrl(testConfig.pages.buttons), {
          waitUntil: 'domcontentloaded',
        });
        await demoQA.buttonsPage.verify.noMessageShown();
      });
      // #endregion

      // #region Act
      await test.step('2. Single click the Double Click Me button', async () => {
        await demoQA.buttonsPage.doubleClickBtn.click();
      });
      // #endregion

      // #region Assert
      await test.step('3. Verify no double click message is displayed', async () => {
        await demoQA.buttonsPage.verify.noMessageShown();
      });
      // #endregion
    }
  );
});
