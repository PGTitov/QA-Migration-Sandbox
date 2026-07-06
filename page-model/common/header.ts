import { Page, Locator } from '@playwright/test';
import { Button } from '../controls/button';
import { HeaderVerify } from './header-verify';

/**
 * Header page model
 */
export class Header {
  readonly verify: HeaderVerify;
  readonly locators: {
    root: Locator;
    logo: Locator;
  };

  private logoButton?: Button;

  constructor(protected readonly page: Page) {
    this.locators = {
      root: this.page.locator('header'),
      logo: this.page.locator('header a img'),
    };
    this.verify = new HeaderVerify(this);
  }

  get logo(): Button {
    return (this.logoButton ??= new Button(
      this.locators.logo.locator('..'),
      'logo'
    ));
  }

  async navigateToHome(): Promise<void> {
    await this.logo.click();
  }

  override toString(): string {
    return 'Header';
  }
}
