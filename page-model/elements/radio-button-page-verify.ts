import { expect } from '@playwright/test';
import { step } from '../../utils/decorators';
import { RadioButtonPage } from './radio-button-page';

/**
 * RadioButton Page verification class
 */
export class RadioButtonPageVerify {
  constructor(protected readonly page: RadioButtonPage) {}

  @step('Verify result shows "{{args[0]}}"')
  async resultShows(expectedText: string): Promise<void> {
    await expect(this.page.locators.resultText).toContainText(expectedText);
  }

  @step('Verify radio button "{{args[0]}}" is disabled')
  async optionIsDisabled(optionLabel: string, isDisabled: boolean = true): Promise<void> {
    await this.page.getOption(optionLabel).verify.disabled(isDisabled);
  }

  toString(): string {
    return 'Radio Button Page';
  }
}
