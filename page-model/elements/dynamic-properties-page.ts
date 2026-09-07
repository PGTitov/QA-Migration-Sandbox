import { Page, Locator } from '@playwright/test';
import { DynamicPropertiesPageVerify } from './dynamic-properties-page-verify';
import { step } from '../../utils/decorators';

/**
 * Dynamic Properties Page Model
 */
export class DynamicPropertiesPage {
  readonly verify: DynamicPropertiesPageVerify;
  readonly locators: {
    root: Locator;
    randomIdText: Locator;
    enableAfterButton: Locator;
    colorChangeButton: Locator;
    visibleAfterButton: Locator;
  };

  constructor(protected readonly page: Page) {
    this.locators = {
      root: this.page.locator('app-dynamic-properties'),
      randomIdText: this.page.getByText('This text has random Id'),
      enableAfterButton: this.page.locator('#enableAfter'),
      colorChangeButton: this.page.locator('#colorChange'),
      visibleAfterButton: this.page.locator('#visibleAfter'),
    };
    this.verify = new DynamicPropertiesPageVerify(this);
  }

  @step('Get the random Id text element id attribute')
  async getRandomIdTextId(): Promise<string | null> {
    return this.locators.randomIdText.getAttribute('id');
  }

  toString(): string {
    return 'Dynamic Properties Page';
  }
}
