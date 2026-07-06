import { expect } from '@playwright/test';
import { step } from '../../utils/decorators';
import { SliderPage } from './slider-page';

/**
 * Slider Page verification class
 */
export class SliderPageVerify {
  constructor(protected readonly page: SliderPage) {}

  @step('Verify slider value is "{{args[0]}}"')
  async sliderValueIs(expectedValue: string): Promise<void> {
    await expect(this.page.locators.sliderInput).toHaveValue(expectedValue);
  }

  @step('Verify slider is visible')
  async sliderIsVisible(): Promise<void> {
    await expect(this.page.locators.slider).toBeVisible();
  }

  override toString(): string {
    return 'Slider Page';
  }
}
