import { Locator, expect } from '@playwright/test';
import { CommonControlVerify, CommonControlOptions } from './common-control-verify';
import { step } from '../../utils/decorators';

/**
 * TextBox verification class
 */
export class TextBoxVerify extends CommonControlVerify {
  constructor(textBox: Locator, options?: CommonControlOptions) {
    super(textBox, options);
  }

  @step('Verify {{this}} has value "{{args[0]}}"')
  async hasValue(expectedValue: string | RegExp): Promise<void> {
    const control = await this.control;
    await expect(control).toHaveValue(expectedValue);
  }

  @step('Verify {{this}} has placeholder "{{args[0]}}"')
  async hasPlaceholder(expectedPlaceholder: string | RegExp): Promise<void> {
    const control = await this.control;
    await expect(control).toHaveAttribute('placeholder', expectedPlaceholder);
  }

  override toString(): string {
    return this.getName();
  }
}
