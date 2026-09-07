import { expect, Download } from '@playwright/test';
import { step } from '../../utils/decorators';
import { UploadDownloadPage } from './upload-download-page';

/**
 * Upload and Download Page verification class
 */
export class UploadDownloadPageVerify {
  constructor(protected readonly page: UploadDownloadPage) {}

  @step('Verify the uploaded file name is "{{args[0]}}"')
  async uploadedFileNameIs(fileName: string): Promise<void> {
    await expect(this.page.locators.uploadedFilePath).toContainText(fileName);
  }

  @step('Verify the downloaded file name is "{{args[0]}}"')
  downloadedFileNameIs(download: Download, fileName: string): void {
    expect(download.suggestedFilename()).toBe(fileName);
  }

  toString(): string {
    return 'Upload and Download Page';
  }
}
