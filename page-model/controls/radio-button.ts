import { Locator } from '@playwright/test';
import { CommonControl } from './common-control';
import { RadioButtonVerify } from './radio-button-verify';
import { CommonControlOptions } from './common-control-verify';
import { step } from '../../utils/decorators';

/**
 * RadioButton control wrapper
 */
export class RadioButton extends CommonControl {
  readonly verify: RadioButtonVerify;

  constructor(
    readonly radioButton: Locator,
    readonly name: string,
    readonly options?: CommonControlOptions
  ) {
    super(radioButton);
    this.verify = new RadioButtonVerify(this.radioButton, options);
  }

  @step('Select {{this}}')
  async select(): Promise<void> {
    await this.radioButton.check();
  }

  @step('Get {{this}} selected state')
  async isSelected(): Promise<boolean> {
    return this.radioButton.isChecked();
  }

  override toString(): string {
    return `${this.name} radio button`;
  }
}
