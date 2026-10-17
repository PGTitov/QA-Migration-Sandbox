import { Locator, Page } from '@playwright/test';
import { step } from '../../utils/decorators';
import { AutoCompletePageVerify } from './auto-complete-page-verify';

export class AutoCompletePage {
  readonly verify: AutoCompletePageVerify;
  readonly locators: {
    root: Locator;
    singleInput: Locator;
    singleValue: Locator;
  };

  constructor(protected readonly page: Page) {
    this.locators = {
      root: page.locator('app-auto-complete'),
      singleInput: page.locator('#autoCompleteSingleInput'),
      singleValue: page.locator('.auto-complete__single-value'),
    };
    this.verify = new AutoCompletePageVerify(this);
  }

  @step('Select "{{args[0]}}" from single-value autocomplete')
  async selectSingleOption(option: string): Promise<void> {
    await this.locators.singleInput.fill(option.slice(0, 2));
    await this.page.getByRole('option', { name: option, exact: true }).click();
  }
}