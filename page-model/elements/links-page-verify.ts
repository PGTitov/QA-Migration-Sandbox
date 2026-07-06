import { expect } from '@playwright/test';
import { step } from '../../utils/decorators';
import { LinksPage } from './links-page';

/**
 * Links Page verification class
 */
export class LinksPageVerify {
  constructor(protected readonly page: LinksPage) {}

  @step('Verify response contains "{{args[0]}}"')
  async responseContains(text: string): Promise<void> {
    await expect(this.page.locators.responseBox).toContainText(text);
  }

  @step('Verify link status code is "{{args[0]}}"')
  async linkStatusCodeIs(statusCode: string): Promise<void> {
    await expect(this.page.locators.responseBox).toContainText(statusCode);
  }

  toString(): string {
    return 'Links Page';
  }
}
