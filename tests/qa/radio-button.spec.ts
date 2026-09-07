import { test, Authors, Priorities } from '../fixtures';
import { getUrl, testConfig } from '../../config';

test.describe('DemoQA Radio Button page', () => {
  test(
    '[TEST-12] Verify selecting Yes displays the correct result',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'TEST-12' },
        { type: 'priority', description: Priorities.Medium },
      ],
    },
    async ({ demoQA, page }) => {
      // #region Arrange
      await test.step('1. Navigate to the Radio Button page', async () => {
        await page.goto(getUrl(testConfig.pages.radioButton), {
          waitUntil: 'domcontentloaded',
        });
      });
      // #endregion

      // #region Act
      await test.step('2. Select the Yes radio button', async () => {
        await demoQA.radioButtonPage.selectOption('Yes');
      });
      // #endregion

      // #region Assert
      await test.step('3. Verify the result shows Yes', async () => {
        await demoQA.radioButtonPage.verify.resultShows('Yes');
      });
      // #endregion
    }
  );

  test(
    '[TEST-13] Verify selecting Impressive displays the correct result',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'TEST-13' },
        { type: 'priority', description: Priorities.Medium },
      ],
    },
    async ({ demoQA, page }) => {
      // #region Arrange
      await test.step('1. Navigate to the Radio Button page', async () => {
        await page.goto(getUrl(testConfig.pages.radioButton), {
          waitUntil: 'domcontentloaded',
        });
      });
      // #endregion

      // #region Act
      await test.step('2. Select the Impressive radio button', async () => {
        await demoQA.radioButtonPage.selectOption('Impressive');
      });
      // #endregion

      // #region Assert
      await test.step('3. Verify the result shows Impressive', async () => {
        await demoQA.radioButtonPage.verify.resultShows('Impressive');
      });
      // #endregion
    }
  );

  test(
    '[TEST-14] Verify selecting Impressive after Yes replaces the result',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'TEST-14' },
        { type: 'priority', description: Priorities.Low },
      ],
    },
    async ({ demoQA, page }) => {
      // #region Arrange
      await test.step('1. Navigate to the Radio Button page and select Yes', async () => {
        await page.goto(getUrl(testConfig.pages.radioButton), {
          waitUntil: 'domcontentloaded',
        });
        await demoQA.radioButtonPage.selectOption('Yes');
        await demoQA.radioButtonPage.verify.resultShows('Yes');
      });
      // #endregion

      // #region Act
      await test.step('2. Select the Impressive radio button', async () => {
        await demoQA.radioButtonPage.selectOption('Impressive');
      });
      // #endregion

      // #region Assert
      await test.step('3. Verify the result now shows Impressive instead of Yes', async () => {
        await demoQA.radioButtonPage.verify.resultShows('Impressive');
      });
      // #endregion
    }
  );

  test(
    '[TEST-15] Verify the No radio button is disabled and cannot be selected',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'TEST-15' },
        { type: 'priority', description: Priorities.High },
      ],
    },
    async ({ demoQA, page }) => {
      // #region Arrange
      await test.step('1. Navigate to the Radio Button page', async () => {
        await page.goto(getUrl(testConfig.pages.radioButton), {
          waitUntil: 'domcontentloaded',
        });
      });
      // #endregion

      // #region Assert
      await test.step('2. Verify the No radio button is disabled', async () => {
        await demoQA.radioButtonPage.verify.optionIsDisabled('No');
      });
      // #endregion
    }
  );
});
