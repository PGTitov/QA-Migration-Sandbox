import { Page, Locator, Download } from '@playwright/test';
import { UploadDownloadPageVerify } from './upload-download-page-verify';
import { step } from '../../utils/decorators';

/**
 * Upload and Download Page Model
 */
export class UploadDownloadPage {
  readonly verify: UploadDownloadPageVerify;
  readonly locators: {
    root: Locator;
    downloadButton: Locator;
    uploadInput: Locator;
    uploadedFilePath: Locator;
  };

  constructor(protected readonly page: Page) {
    this.locators = {
      root: this.page.locator('app-upload-download'),
      downloadButton: this.page.locator('#downloadButton'),
      uploadInput: this.page.locator('#uploadFile'),
      uploadedFilePath: this.page.locator('#uploadedFilePath'),
    };
    this.verify = new UploadDownloadPageVerify(this);
  }

  @step('Download the sample file')
  async download(): Promise<Download> {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.locators.downloadButton.click(),
    ]);
    return download;
  }

  @step('Upload file "{{args[0]}}"')
  async uploadFile(filePath: string): Promise<void> {
    await this.locators.uploadInput.setInputFiles(filePath);
  }

  toString(): string {
    return 'Upload and Download Page';
  }
}
