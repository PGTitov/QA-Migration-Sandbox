import { Locator } from '@playwright/test';
import { CommonControl } from './common-control';
import { CheckBoxVerify } from './check-box-verify';
import { CommonControlOptions } from './common-control-verify';
import { step } from '../../utils/decorators';

/**
 * CheckBox control wrapper
 */
export class CheckBox extends CommonControl {
  readonly verify: CheckBoxVerify;

  constructor(
    readonly checkBox: Locator,
    readonly name: string,
    readonly options?: CommonControlOptions
  ) {
    super(checkBox);
    this.verify = new CheckBoxVerify(this.checkBox, options);
  }

  @step('Check {{this}}')
  async check(): Promise<void> {
    await this.checkBox.check();
  }

  @step('Uncheck {{this}}')
  async uncheck(): Promise<void> {
    await this.checkBox.uncheck();
  }

  @step('Set {{this}} to {{args[0]}}')
  async setChecked(checked: boolean): Promise<void> {
    if (checked) {
      await this.check();
    } else {
      await this.uncheck();
    }
  }

  @step('Get {{this}} checked state')
  async isChecked(): Promise<boolean> {
    return this.checkBox.isChecked();
  }

  override toString(): string {
    return `${this.name} checkbox`;
  }
}
