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

  @step('Verify email field has a pattern mismatch')
  async emailPatternMismatchIsPresent(): Promise<void> {
    const emailHasPatternMismatch = await this.page.locators.emailInput.evaluate(
      (input: HTMLInputElement) => input.validity.patternMismatch
    );
    expect(emailHasPatternMismatch).toBe(true);
  }

  @step('Verify success dialog is hidden')
  async successDialogIsHidden(): Promise<void> {
    await expect(this.page.locators.successDialog).toBeHidden();
  }

  toString(): string {
    return 'Practice Form Page';
  }
}
