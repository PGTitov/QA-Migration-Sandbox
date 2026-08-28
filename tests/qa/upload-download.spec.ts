import path from 'path';
import { test, Authors, Priorities } from '../fixtures';
import { getUrl, testConfig } from '../../config';

const sampleFilePath = path.join(__dirname, '..', '..', 'data', 'files', 'sample-upload.txt');

test.describe('DemoQA Upload and Download page', () => {
  test(
    '[TEST-50] Verify uploading a file displays its name',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'TEST-50' },
        { type: 'priority', description: Priorities.High },
      ],
    },
    async ({ demoQA, page }) => {
      // #region Arrange
      await test.step('1. Navigate to the Upload and Download page', async () => {
        await page.goto(getUrl(testConfig.pages.uploadDownload), {
          waitUntil: 'domcontentloaded',
        });
      });
      // #endregion

      // #region Act
      await test.step('2. Upload the sample file', async () => {
        await demoQA.uploadDownloadPage.uploadFile(sampleFilePath);
      });
      // #endregion

      // #region Assert
      await test.step('3. Verify the uploaded file name is displayed', async () => {
        await demoQA.uploadDownloadPage.verify.uploadedFileNameIs('sample-upload.txt');
      });
      // #endregion
    }
  );

  test(
    '[TEST-51] Verify clicking Download downloads the sample file',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'TEST-51' },
        { type: 'priority', description: Priorities.High },
      ],
    },
    async ({ demoQA, page }) => {
      // #region Arrange
      await test.step('1. Navigate to the Upload and Download page', async () => {
        await page.goto(getUrl(testConfig.pages.uploadDownload), {
          waitUntil: 'domcontentloaded',
        });
      });
      // #endregion

      // #region Act
      let download: Awaited<ReturnType<typeof demoQA.uploadDownloadPage.download>>;
      await test.step('2. Click the Download button', async () => {
        download = await demoQA.uploadDownloadPage.download();
      });
      // #endregion

      // #region Assert
      await test.step('3. Verify the downloaded file name is sampleFile.jpeg', async () => {
        demoQA.uploadDownloadPage.verify.downloadedFileNameIs(download, 'sampleFile.jpeg');
      });
      // #endregion
    }
  );

  test(
    '[TEST-52] Verify uploading a different file replaces the previously displayed name',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'TEST-52' },
        { type: 'priority', description: Priorities.Medium },
      ],
    },
    async ({ demoQA, page }) => {
      // #region Arrange
      await test.step('1. Navigate to the Upload and Download page and upload a file', async () => {
        await page.goto(getUrl(testConfig.pages.uploadDownload), {
          waitUntil: 'domcontentloaded',
        });
        await demoQA.uploadDownloadPage.uploadFile(sampleFilePath);
        await demoQA.uploadDownloadPage.verify.uploadedFileNameIs('sample-upload.txt');
      });
      // #endregion

      // #region Act
      await test.step('2. Upload a different file', async () => {
        await demoQA.uploadDownloadPage.uploadFile(
          path.join(__dirname, '..', '..', 'package.json')
        );
      });
      // #endregion

      // #region Assert
      await test.step('3. Verify the displayed file name is updated to the new file', async () => {
        await demoQA.uploadDownloadPage.verify.uploadedFileNameIs('package.json');
      });
      // #endregion
    }
  );
});
