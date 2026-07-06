import { expect } from '@playwright/test';
import { step } from '../../utils/decorators';
import { PracticeFormPage } from './practice-form-page';

/**
 * Practice Form Page verification class
 */
export class PracticeFormPageVerify {
  constructor(protected readonly page: PracticeFormPage) {}

  @step('Verify form submission success message appears')
  async successMessageAppears(): Promise<void> {
    await expect(this.page.locators.successMessage).toBeVisible();
  }

  @step('Verify success message contains "{{args[0]}}"')
  async successMessageContains(text: string): Promise<void> {
    await expect(this.page.locators.successMessage).toContainText(text);
  }

  override toString(): string {
    return 'Practice Form Page';
  }
}
