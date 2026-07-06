import { Locator, expect } from '@playwright/test';
import { CommonControlVerify, CommonControlOptions } from './common-control-verify';
import { step } from '../../utils/decorators';

/**
 * RadioButton verification class
 */
export class RadioButtonVerify extends CommonControlVerify {
  constructor(radioButton: Locator, options?: CommonControlOptions) {
    super(radioButton, options);
  }

  @step('Verify {{this}} is selected')
  async isSelected(selected: boolean = true): Promise<void> {
    const control = await this.control;
    if (selected) {
      await expect(control).toBeChecked();
    } else {
      await expect(control).not.toBeChecked();
    }
  }

  toString(): string {
    return this.getName();
  }
}
