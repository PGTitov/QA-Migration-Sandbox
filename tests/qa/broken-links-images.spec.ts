import { test, expect, Authors, Priorities } from '../fixtures';
import { APIResponse } from '@playwright/test';
import { getUrl, testConfig } from '../../config';

test.describe('DemoQA Broken Links - Images page', () => {
  test(
    '[TEST-45] Verify the valid image loads successfully',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'TEST-45' },
        { type: 'priority', description: Priorities.Medium },
      ],
    },
    async ({ demoQA, page }) => {
      // Known demoqa.com defect: the "valid" image currently fails to render too.
      test.fail(true, 'demoqa.com serves the "valid" image broken as well');

      // #region Arrange
      await test.step('1. Navigate to the Broken Links - Images page', async () => {
        await page.goto(getUrl(testConfig.pages.brokenLinksImages), {
          waitUntil: 'domcontentloaded',
        });
      });
      // #endregion

      // #region Assert
      await test.step('2. Verify the valid image renders correctly', async () => {
        await demoQA.brokenLinksImagesPage.verify.validImageLoadsSuccessfully();
      });
      // #endregion
    }
  );

  test(
    '[TEST-46] Verify the broken image fails to load',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'TEST-46' },
        { type: 'priority', description: Priorities.Medium },
      ],
    },
    async ({ demoQA, page }) => {
      // #region Arrange
      await test.step('1. Navigate to the Broken Links - Images page', async () => {
        await page.goto(getUrl(testConfig.pages.brokenLinksImages), {
          waitUntil: 'domcontentloaded',
        });
      });
      // #endregion

      // #region Assert
      await test.step('2. Verify the broken image does not render', async () => {
        await demoQA.brokenLinksImagesPage.verify.brokenImageFailsToLoad();
      });
      // #endregion
    }
  );

  test(
    '[TEST-47] Verify the valid link points to demoqa.com',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'TEST-47' },
        { type: 'priority', description: Priorities.Low },
      ],
    },
    async ({ demoQA, page }) => {
      // #region Arrange
      await test.step('1. Navigate to the Broken Links - Images page', async () => {
        await page.goto(getUrl(testConfig.pages.brokenLinksImages), {
          waitUntil: 'domcontentloaded',
        });
      });
      // #endregion

      // #region Assert
      await test.step('2. Verify the valid link href', async () => {
        await demoQA.brokenLinksImagesPage.verify.validLinkHrefIs(
          'http://demoqa.com'
        );
      });
      // #endregion
    }
  );

  test(
    '[TEST-48] Verify the broken link points to a URL returning a server error',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'TEST-48' },
        { type: 'priority', description: Priorities.Low },
      ],
    },
    async ({ demoQA, page }) => {
      // #region Arrange
      await test.step('1. Navigate to the Broken Links - Images page', async () => {
        await page.goto(getUrl(testConfig.pages.brokenLinksImages), {
          waitUntil: 'domcontentloaded',
        });
      });
      // #endregion

      // #region Assert
      await test.step('2. Verify the broken link href', async () => {
        await demoQA.brokenLinksImagesPage.verify.brokenLinkHrefIs(
          'http://the-internet.herokuapp.com/status_codes/500'
        );
      });
      // #endregion
    }
  );

  test(
    '[TEST-49] Verify the broken link URL responds with a server error status',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'TEST-49' },
        { type: 'priority', description: Priorities.Medium },
      ],
    },
    async ({ demoQA, page, request }) => {
      // #region Arrange
      let brokenLinkHref = '';

      await test.step('1. Navigate to the Broken Links - Images page', async () => {
        await page.goto(getUrl(testConfig.pages.brokenLinksImages), {
          waitUntil: 'domcontentloaded',
        });
        brokenLinkHref =
          (await demoQA.brokenLinksImagesPage.locators.brokenLink.getAttribute(
            'href'
          )) ?? '';
      });
      // #endregion

      // #region Act
      let response: APIResponse;
      await test.step('2. Request the broken link URL', async () => {
        response = await request.get(brokenLinkHref);
      });
      // #endregion

      // #region Assert
      await test.step('3. Verify the response status is a server error', async () => {
        expect(response.status()).toBe(500);
      });
      // #endregion
    }
  );
});
