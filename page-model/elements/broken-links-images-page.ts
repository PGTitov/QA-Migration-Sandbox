import { Page, Locator } from '@playwright/test';
import { BrokenLinksImagesPageVerify } from './broken-links-images-page-verify';
import { step } from '../../utils/decorators';

/**
 * Broken Links - Images Page Model
 */
export class BrokenLinksImagesPage {
  readonly verify: BrokenLinksImagesPageVerify;
  readonly locators: {
    root: Locator;
    validImage: Locator;
    brokenImage: Locator;
    validLink: Locator;
    brokenLink: Locator;
  };

  constructor(protected readonly page: Page) {
    this.locators = {
      root: this.page.locator('app-broken'),
      validImage: this.page.locator('img').nth(1),
      brokenImage: this.page.locator('img').nth(2),
      validLink: this.page.getByRole('link', { name: 'Click Here for Valid Link' }),
      brokenLink: this.page.getByRole('link', { name: 'Click Here for Broken Link' }),
    };
    this.verify = new BrokenLinksImagesPageVerify(this);
  }

  toString(): string {
    return 'Broken Links - Images Page';
  }
}
