import { Locator, expect } from '@playwright/test';
import { CommonControlVerify, CommonControlOptions } from './common-control-verify';
import { step } from '../../utils/decorators';

/**
 * CheckBox verification class
 */
export class CheckBoxVerify extends CommonControlVerify {
  constructor(checkBox: Locator, options?: CommonControlOptions) {
    super(checkBox, options);
  }

  @step('Verify {{this}} is checked')
  async isChecked(checked: boolean = true): Promise<void> {
    const control = await this.control;
    if (checked) {
      await expect(control).toBeChecked();
    } else {
      await expect(control).not.toBeChecked();
    }
  }

  override toString(): string {
    return this.getName();
  }
}
