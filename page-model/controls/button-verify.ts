import { Locator, expect } from '@playwright/test';
import { CommonControlVerify, CommonControlOptions } from './common-control-verify';
import { step } from '../../utils/decorators';

/**
 * Button verification class
 */
export class ButtonVerify extends CommonControlVerify {
  constructor(button: Locator, options?: CommonControlOptions) {
    super(button, options);
  }

  @step('Verify "{{this}}" button has text "{{args[0]}}"')
  async hasText(expectedText: string | RegExp): Promise<void> {
    const control = await this.control;
    await expect(control).toContainText(expectedText);
  }

  toString(): string {
    return this.getName();
  }
}
