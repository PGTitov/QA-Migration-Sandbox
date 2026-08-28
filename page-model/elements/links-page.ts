import { Page, Locator } from '@playwright/test';
import { LinksPageVerify } from './links-page-verify';
import { step } from '../../utils/decorators';

/**
 * Links Page Model
 */
export class LinksPage {
  readonly verify: LinksPageVerify;
  readonly locators: {
    root: Locator;
    homeLink: Locator;
    dynamicLink: Locator;
    createdLink: Locator;
    noContentLink: Locator;
    movedLink: Locator;
    badRequestLink: Locator;
    unauthorizedLink: Locator;
    forbiddenLink: Locator;
    notFoundLink: Locator;
    responseBox: Locator;
  };

  constructor(protected readonly page: Page) {
    this.locators = {
      root: this.page.locator('app-links'),
      homeLink: this.page.locator('#simpleLink'),
      dynamicLink: this.page.locator('#dynamicLink'),
      createdLink: this.page.locator('a[id="created"]'),
      noContentLink: this.page.locator('a[id="no-content"]'),
      movedLink: this.page.locator('a[id="moved"]'),
      badRequestLink: this.page.locator('a[id="bad-request"]'),
      unauthorizedLink: this.page.locator('a[id="unauthorized"]'),
      forbiddenLink: this.page.locator('a[id="forbidden"]'),
      notFoundLink: this.page.locator('a[id="invalid-url"]'),
      responseBox: this.page.locator('#linkResponse'),
    };
    this.verify = new LinksPageVerify(this);
  }

  @step('Click home link')
  async clickHomeLink(): Promise<void> {
    await this.locators.homeLink.click();
  }

  @step('Click dynamic link')
  async clickDynamicLink(): Promise<void> {
    await this.locators.dynamicLink.click();
  }

  @step('Click home link and capture the new tab')
  async openHomeLinkInNewTab(): Promise<Page> {
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.clickHomeLink(),
    ]);
    await newPage.waitForLoadState();
    return newPage;
  }

  @step('Click dynamic link and capture the new tab')
  async openDynamicLinkInNewTab(): Promise<Page> {
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.clickDynamicLink(),
    ]);
    await newPage.waitForLoadState();
    return newPage;
  }

  @step('Click "{{args[0]}}" link')
  async clickLink(linkId: string): Promise<void> {
    const link = this.page.locator(`a[id="${linkId}"]`);
    await link.click();
  }

  toString(): string {
    return 'Links Page';
  }
}
