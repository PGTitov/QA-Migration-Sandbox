import { Page, Locator } from '@playwright/test';
import { SliderPageVerify } from './slider-page-verify';
import { step } from '../../utils/decorators';

/**
 * Slider Page Model
 */
export class SliderPage {
  readonly verify: SliderPageVerify;
  readonly locators: {
    root: Locator;
    slider: Locator;
    sliderInput: Locator;
    sliderValue: Locator;
  };

  constructor(protected readonly page: Page) {
    this.locators = {
      root: this.page.locator('app-slider'),
      slider: this.page.locator('.rc-slider'),
      sliderInput: this.page.locator('#sliderID'),
      sliderValue: this.page.locator('.mt-4'),
    };
    this.verify = new SliderPageVerify(this);
  }

  @step('Set slider value to "{{args[0]}}"')
  async setSliderValue(value: string): Promise<void> {
    await this.locators.sliderInput.fill(value);
  }

  @step('Get slider value')
  async getSliderValue(): Promise<string> {
    return this.locators.sliderInput.inputValue();
  }

  @step('Drag slider to position {{args[0]}}')
  async dragSliderToPosition(xOffset: number): Promise<void> {
    const sliderElement = this.locators.slider;
    await sliderElement.dragTo(sliderElement, { targetPosition: { x: xOffset, y: 0 } });
  }

  override toString(): string {
    return 'Slider Page';
  }
}
