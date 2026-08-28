import { test, expect, Authors, Priorities } from '../fixtures';
import { getUrl, testConfig } from '../../config';

test.describe('DemoQA Dynamic Properties page', () => {
  test(
    '[TEST-53] Verify the enable-after button is disabled on load and becomes enabled after 5 seconds',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'TEST-53' },
        { type: 'priority', description: Priorities.High },
      ],
    },
    async ({ demoQA, page }) => {
      // #region Arrange
      await test.step('1. Navigate to the Dynamic Properties page', async () => {
        await page.goto(getUrl(testConfig.pages.dynamicProperties), {
          waitUntil: 'domcontentloaded',
        });
      });
      // #endregion

      // #region Assert
      await test.step('2. Verify the button is disabled immediately after load', async () => {
        await demoQA.dynamicPropertiesPage.verify.enableAfterButtonIsDisabled();
      });

      await test.step('3. Verify the button becomes enabled after 5 seconds', async () => {
        await demoQA.dynamicPropertiesPage.verify.enableAfterButtonIsDisabled(false);
      });
      // #endregion
    }
  );

  test(
    '[TEST-54] Verify the Color Change button gets the danger color after 5 seconds',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'TEST-54' },
        { type: 'priority', description: Priorities.Medium },
      ],
    },
    async ({ demoQA, page }) => {
      // #region Arrange
      await test.step('1. Navigate to the Dynamic Properties page', async () => {
        await page.goto(getUrl(testConfig.pages.dynamicProperties), {
          waitUntil: 'domcontentloaded',
        });
      });
      // #endregion

      // #region Assert
      await test.step('2. Verify the button has no danger color immediately after load', async () => {
        await demoQA.dynamicPropertiesPage.verify.colorChangeButtonHasDangerColor(false);
      });

      await test.step('3. Verify the button gets the danger color after 5 seconds', async () => {
        await demoQA.dynamicPropertiesPage.verify.colorChangeButtonHasDangerColor();
      });
      // #endregion
    }
  );

  test(
    '[TEST-55] Verify the Visible After5 Seconds button is hidden on load and appears after 5 seconds',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'TEST-55' },
        { type: 'priority', description: Priorities.High },
      ],
    },
    async ({ demoQA, page }) => {
      // #region Arrange
      await test.step('1. Navigate to the Dynamic Properties page', async () => {
        await page.goto(getUrl(testConfig.pages.dynamicProperties), {
          waitUntil: 'domcontentloaded',
        });
      });
      // #endregion

      // #region Assert
      await test.step('2. Verify the button is not present immediately after load', async () => {
        await demoQA.dynamicPropertiesPage.verify.visibleAfterButtonIsVisible(false);
      });

      await test.step('3. Verify the button becomes visible after 5 seconds', async () => {
        await demoQA.dynamicPropertiesPage.verify.visibleAfterButtonIsVisible();
      });
      // #endregion
    }
  );

  test(
    '[TEST-56] Verify the random Id text element gets a new id on every page load',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'TEST-56' },
        { type: 'priority', description: Priorities.Low },
      ],
    },
    async ({ demoQA, page }) => {
      // #region Arrange
      let firstId: string | null;
      await test.step('1. Navigate to the Dynamic Properties page', async () => {
        await page.goto(getUrl(testConfig.pages.dynamicProperties), {
          waitUntil: 'domcontentloaded',
        });
        firstId = await demoQA.dynamicPropertiesPage.getRandomIdTextId();
      });
      // #endregion

      // #region Act
      let secondId: string | null;
      await test.step('2. Reload the page', async () => {
        await page.reload({ waitUntil: 'domcontentloaded' });
        secondId = await demoQA.dynamicPropertiesPage.getRandomIdTextId();
      });
      // #endregion

      // #region Assert
      await test.step('3. Verify the id changed between page loads', async () => {
        expect(secondId).not.toBe(firstId);
      });
      // #endregion
    }
  );
});
