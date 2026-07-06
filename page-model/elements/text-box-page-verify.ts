import { expect } from '@playwright/test';
import { step } from '../../utils/decorators';
import { TextBoxPage } from './text-box-page';

/**
 * Text Box Page verification class
 */
export class TextBoxPageVerify {
  constructor(protected readonly page: TextBoxPage) {}

  @step('Verify output contains Name "{{args[0]}}"')
  async outputContainsName(name: string): Promise<void> {
    await expect(this.page.locators.outputContainer).toContainText(`Name:${name}`);
  }

  @step('Verify output contains Email "{{args[0]}}"')
  async outputContainsEmail(email: string): Promise<void> {
    await expect(this.page.locators.outputContainer).toContainText(
      `Email:${email}`
    );
  }

  override toString(): string {
    return 'Text Box Page';
  }
}
