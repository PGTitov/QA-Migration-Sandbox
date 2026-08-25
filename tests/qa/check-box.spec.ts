import { test } from '../fixtures';
import { getUrl, testConfig } from '../../config';

test.describe('DemoQA Check Box page', () => {
  test(
    '[TEST-9] Verify the checkbox tree is displayed',
    async ({ demoQA, page }) => {
      // #region Arrange
      await test.step('1. Navigate to the Check Box page', async () => {
        await page.goto(getUrl(testConfig.pages.checkbox), {
          waitUntil: 'domcontentloaded',
        });
      });
      // #endregion

      // #region Act
      await test.step('2. Wait for the checkbox tree to load', async () => {
        await demoQA.checkBoxPage.verify.treeViewIsVisible();
      });
      // #endregion

      // #region Assert
      await test.step('3. Verify the checkbox tree is visible', async () => {
        await demoQA.checkBoxPage.verify.treeViewIsVisible();
      });
      // #endregion
    }
  );

  test(
    '[TEST-10] Verify selecting a checkbox displays its result',
    async ({ demoQA, page }) => {
      // #region Arrange
      await test.step('1. Navigate to the Check Box page', async () => {
        await page.goto(getUrl(testConfig.pages.checkbox), {
          waitUntil: 'domcontentloaded',
        });
        await demoQA.checkBoxPage.verify.treeViewIsVisible();
      });
      // #endregion

      // #region Act
      await test.step('2. Select the Home checkbox', async () => {
        await demoQA.checkBoxPage.checkItem('Home');
      });
      // #endregion

      // #region Assert
      await test.step('3. Verify Home is displayed in the results', async () => {
        await demoQA.checkBoxPage.verify.itemIsSelected('home');
      });
      // #endregion
    }
  );

  test(
    '[TEST-11] Verify unchecking a checkbox removes its result',
    async ({ demoQA, page }) => {
      // #region Arrange
      await test.step('1. Navigate to the Check Box page', async () => {
        await page.goto(getUrl(testConfig.pages.checkbox), {
          waitUntil: 'domcontentloaded',
        });
        await demoQA.checkBoxPage.verify.treeViewIsVisible();
      });
      // #endregion

      // #region Act
      await test.step('2. Select and then uncheck Home', async () => {
        await demoQA.checkBoxPage.checkItem('Home');
        await demoQA.checkBoxPage.uncheckItem('Home');
      });
      // #endregion

      // #region Assert
      await test.step('3. Verify Home is not displayed in the results', async () => {
        await demoQA.checkBoxPage.verify.itemIsNotSelected('home');
      });
      // #endregion
    }
  );
});
