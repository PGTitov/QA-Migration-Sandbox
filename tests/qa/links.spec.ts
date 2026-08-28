import { test, Authors, Priorities } from '../fixtures';
import { Page } from '@playwright/test';
import { getUrl, testConfig } from '../../config';

test.describe('DemoQA Links page', () => {
  test(
    '[TEST-35] Verify the Home link opens demoqa.com in a new tab',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'TEST-35' },
        { type: 'priority', description: Priorities.Medium },
      ],
    },
    async ({ demoQA, page }) => {
      // #region Arrange
      await test.step('1. Navigate to the Links page', async () => {
        await page.goto(getUrl(testConfig.pages.links), {
          waitUntil: 'domcontentloaded',
        });
      });
      // #endregion

      // #region Act
      let newTab: Page;
      await test.step('2. Click the Home link', async () => {
        newTab = await demoQA.linksPage.openHomeLinkInNewTab();
      });
      // #endregion

      // #region Assert
      await test.step('3. Verify a new tab opened to demoqa.com', async () => {
        await demoQA.linksPage.verify.newTabUrlIs(newTab, 'https://demoqa.com/');
      });
      // #endregion
    }
  );

  test(
    '[TEST-36] Verify the dynamic Home link opens demoqa.com in a new tab',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'TEST-36' },
        { type: 'priority', description: Priorities.Low },
      ],
    },
    async ({ demoQA, page }) => {
      // #region Arrange
      await test.step('1. Navigate to the Links page', async () => {
        await page.goto(getUrl(testConfig.pages.links), {
          waitUntil: 'domcontentloaded',
        });
      });
      // #endregion

      // #region Act
      let newTab: Page;
      await test.step('2. Click the dynamic Home link', async () => {
        newTab = await demoQA.linksPage.openDynamicLinkInNewTab();
      });
      // #endregion

      // #region Assert
      await test.step('3. Verify a new tab opened to demoqa.com', async () => {
        await demoQA.linksPage.verify.newTabUrlIs(newTab, 'https://demoqa.com/');
      });
      // #endregion
    }
  );

  test(
    '[TEST-37] Verify the Created link responds with 201 Created',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'TEST-37' },
        { type: 'priority', description: Priorities.Medium },
      ],
    },
    async ({ demoQA, page }) => {
      // #region Arrange
      await test.step('1. Navigate to the Links page', async () => {
        await page.goto(getUrl(testConfig.pages.links), {
          waitUntil: 'domcontentloaded',
        });
      });
      // #endregion

      // #region Act
      await test.step('2. Click the Created link', async () => {
        await demoQA.linksPage.clickLink('created');
      });
      // #endregion

      // #region Assert
      await test.step('3. Verify the response shows 201 Created', async () => {
        await demoQA.linksPage.verify.responseContains('201');
        await demoQA.linksPage.verify.responseContains('Created');
      });
      // #endregion
    }
  );

  test(
    '[TEST-38] Verify the No Content link responds with 204 No Content',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'TEST-38' },
        { type: 'priority', description: Priorities.Medium },
      ],
    },
    async ({ demoQA, page }) => {
      // #region Arrange
      await test.step('1. Navigate to the Links page', async () => {
        await page.goto(getUrl(testConfig.pages.links), {
          waitUntil: 'domcontentloaded',
        });
      });
      // #endregion

      // #region Act
      await test.step('2. Click the No Content link', async () => {
        await demoQA.linksPage.clickLink('no-content');
      });
      // #endregion

      // #region Assert
      await test.step('3. Verify the response shows 204 No Content', async () => {
        await demoQA.linksPage.verify.responseContains('204');
        await demoQA.linksPage.verify.responseContains('No Content');
      });
      // #endregion
    }
  );

  test(
    '[TEST-39] Verify the Moved link responds with 301 Moved Permanently',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'TEST-39' },
        { type: 'priority', description: Priorities.Medium },
      ],
    },
    async ({ demoQA, page }) => {
      // #region Arrange
      await test.step('1. Navigate to the Links page', async () => {
        await page.goto(getUrl(testConfig.pages.links), {
          waitUntil: 'domcontentloaded',
        });
      });
      // #endregion

      // #region Act
      await test.step('2. Click the Moved link', async () => {
        await demoQA.linksPage.clickLink('moved');
      });
      // #endregion

      // #region Assert
      await test.step('3. Verify the response shows 301 Moved Permanently', async () => {
        await demoQA.linksPage.verify.responseContains('301');
        await demoQA.linksPage.verify.responseContains('Moved Permanently');
      });
      // #endregion
    }
  );

  test(
    '[TEST-40] Verify the Bad Request link responds with 400 Bad Request',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'TEST-40' },
        { type: 'priority', description: Priorities.High },
      ],
    },
    async ({ demoQA, page }) => {
      // #region Arrange
      await test.step('1. Navigate to the Links page', async () => {
        await page.goto(getUrl(testConfig.pages.links), {
          waitUntil: 'domcontentloaded',
        });
      });
      // #endregion

      // #region Act
      await test.step('2. Click the Bad Request link', async () => {
        await demoQA.linksPage.clickLink('bad-request');
      });
      // #endregion

      // #region Assert
      await test.step('3. Verify the response shows 400 Bad Request', async () => {
        await demoQA.linksPage.verify.responseContains('400');
        await demoQA.linksPage.verify.responseContains('Bad Request');
      });
      // #endregion
    }
  );

  test(
    '[TEST-41] Verify the Unauthorized link responds with 401 Unauthorized',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'TEST-41' },
        { type: 'priority', description: Priorities.High },
      ],
    },
    async ({ demoQA, page }) => {
      // #region Arrange
      await test.step('1. Navigate to the Links page', async () => {
        await page.goto(getUrl(testConfig.pages.links), {
          waitUntil: 'domcontentloaded',
        });
      });
      // #endregion

      // #region Act
      await test.step('2. Click the Unauthorized link', async () => {
        await demoQA.linksPage.clickLink('unauthorized');
      });
      // #endregion

      // #region Assert
      await test.step('3. Verify the response shows 401 Unauthorized', async () => {
        await demoQA.linksPage.verify.responseContains('401');
        await demoQA.linksPage.verify.responseContains('Unauthorized');
      });
      // #endregion
    }
  );

  test(
    '[TEST-42] Verify the Forbidden link responds with 403 Forbidden',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'TEST-42' },
        { type: 'priority', description: Priorities.High },
      ],
    },
    async ({ demoQA, page }) => {
      // #region Arrange
      await test.step('1. Navigate to the Links page', async () => {
        await page.goto(getUrl(testConfig.pages.links), {
          waitUntil: 'domcontentloaded',
        });
      });
      // #endregion

      // #region Act
      await test.step('2. Click the Forbidden link', async () => {
        await demoQA.linksPage.clickLink('forbidden');
      });
      // #endregion

      // #region Assert
      await test.step('3. Verify the response shows 403 Forbidden', async () => {
        await demoQA.linksPage.verify.responseContains('403');
        await demoQA.linksPage.verify.responseContains('Forbidden');
      });
      // #endregion
    }
  );

  test(
    '[TEST-43] Verify the Not Found link responds with 404 Not Found',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'TEST-43' },
        { type: 'priority', description: Priorities.High },
      ],
    },
    async ({ demoQA, page }) => {
      // #region Arrange
      await test.step('1. Navigate to the Links page', async () => {
        await page.goto(getUrl(testConfig.pages.links), {
          waitUntil: 'domcontentloaded',
        });
      });
      // #endregion

      // #region Act
      await test.step('2. Click the Not Found link', async () => {
        await demoQA.linksPage.clickLink('invalid-url');
      });
      // #endregion

      // #region Assert
      await test.step('3. Verify the response shows 404 Not Found', async () => {
        await demoQA.linksPage.verify.responseContains('404');
        await demoQA.linksPage.verify.responseContains('Not Found');
      });
      // #endregion
    }
  );

  test(
    '[TEST-44] Verify the response is not shown before any API link is clicked',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'TEST-44' },
        { type: 'priority', description: Priorities.Low },
      ],
    },
    async ({ demoQA, page }) => {
      // #region Arrange
      await test.step('1. Navigate to the Links page', async () => {
        await page.goto(getUrl(testConfig.pages.links), {
          waitUntil: 'domcontentloaded',
        });
      });
      // #endregion

      // #region Assert
      await test.step('2. Verify no response text is displayed', async () => {
        await demoQA.linksPage.verify.responseIsNotShown();
      });
      // #endregion
    }
  );
});
