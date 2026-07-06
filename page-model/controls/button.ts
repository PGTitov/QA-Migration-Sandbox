import { Locator } from '@playwright/test';
import { CommonControl } from './common-control';
import { ButtonVerify } from './button-verify';
import { CommonControlOptions } from './common-control-verify';
import { step } from '../../utils/decorators';

/**
 * Button control wrapper
 */
export class Button extends CommonControl {
  readonly verify: ButtonVerify;

  constructor(
    readonly button: Locator,
    readonly name: string,
    readonly options?: CommonControlOptions
  ) {
    super(button);
    this.verify = new ButtonVerify(this.button, options);
  }

  @step('Click "{{this}}" button')
  override async click(): Promise<void> {
    await super.click();
  }

  @step('Get "{{this}}" button text')
  async getText(): Promise<string> {
    return this.button.textContent() as Promise<string>;
  }

  override toString(): string {
    return `${this.name} button`;
  }
}
