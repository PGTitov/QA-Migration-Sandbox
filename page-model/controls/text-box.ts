import { Locator } from '@playwright/test';
import { CommonControl } from './common-control';
import { TextBoxVerify } from './text-box-verify';
import { CommonControlOptions } from './common-control-verify';
import { step } from '../../utils/decorators';

/**
 * TextBox control wrapper
 */
export class TextBox extends CommonControl {
  readonly verify: TextBoxVerify;

  constructor(
    readonly textBox: Locator,
    readonly name: string,
    readonly options?: CommonControlOptions
  ) {
    super(textBox);
    this.verify = new TextBoxVerify(this.textBox, options);
  }

  @step('Type "{{args[0]}}" into {{this}}')
  async typeText(text: string): Promise<void> {
    await this.textBox.fill(text);
  }

  @step('Clear {{this}}')
  async clear(): Promise<void> {
    await this.textBox.clear();
  }

  @step('Get {{this}} value')
  async getValue(): Promise<string> {
    return this.textBox.inputValue();
  }

  toString(): string {
    return `${this.name} text box`;
  }
}
