import { expect } from '@playwright/test';
import { step } from '../../utils/decorators';
import { BrokenLinksImagesPage } from './broken-links-images-page';

/**
 * Broken Links - Images Page verification class
 */
export class BrokenLinksImagesPageVerify {
  constructor(protected readonly page: BrokenLinksImagesPage) {}

  @step('Verify the valid image loads successfully')
  async validImageLoadsSuccessfully(): Promise<void> {
    await expect(this.page.locators.validImage).toBeVisible();
    const naturalWidth = await this.page.locators.validImage.evaluate(
      (img: HTMLImageElement) => img.naturalWidth
    );
    expect(naturalWidth).toBeGreaterThan(0);
  }

  @step('Verify the broken image fails to load')
  async brokenImageFailsToLoad(): Promise<void> {
    const naturalWidth = await this.page.locators.brokenImage.evaluate(
      (img: HTMLImageElement) => img.naturalWidth
    );
    expect(naturalWidth).toBe(0);
  }

  @step('Verify the valid link points to "{{args[0]}}"')
  async validLinkHrefIs(url: string | RegExp): Promise<void> {
    await expect(this.page.locators.validLink).toHaveAttribute('href', url);
  }

  @step('Verify the broken link points to "{{args[0]}}"')
  async brokenLinkHrefIs(url: string | RegExp): Promise<void> {
    await expect(this.page.locators.brokenLink).toHaveAttribute('href', url);
  }

  toString(): string {
    return 'Broken Links - Images Page';
  }
}
