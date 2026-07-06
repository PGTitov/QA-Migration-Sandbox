import { Page, Locator } from '@playwright/test';
import { RadioButton } from '../controls/radio-button';
import { RadioButtonPageVerify } from './radio-button-page-verify';
import { step } from '../../utils/decorators';

/**
 * RadioButton Page Model
 */
export class RadioButtonPage {
  readonly verify: RadioButtonPageVerify;
  readonly locators: {
    root: Locator;
    radioButtons: Locator;
    resultText: Locator;
  };

  constructor(protected readonly page: Page) {
    this.locators = {
      root: this.page.locator('app-radio-button'),
      radioButtons: this.page.locator('input[type="radio"]'),
      resultText: this.page.locator('.mt-3'),
    };
    this.verify = new RadioButtonPageVerify(this);
  }

  @step('Select radio button "{{args[0]}}"')
  async selectOption(optionLabel: string): Promise<void> {
    const label = this.page.locator(`.form-check-label:text("${optionLabel}")`);
    const radioInput = label.locator('xpath=preceding-sibling::input[@type="radio"]');
    const button = new RadioButton(radioInput, optionLabel);
    await button.select();
  }

  @step('Get selected radio button')
  async getSelectedOption(): Promise<string | null> {
    const selectedRadio = await this.page
      .locator('input[type="radio"]:checked')
      .evaluate((el: HTMLInputElement) => el.value);
    return selectedRadio;
  }

  override toString(): string {
    return 'Radio Button Page';
  }
}
