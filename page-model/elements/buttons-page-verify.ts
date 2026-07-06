import { expect } from '@playwright/test';
import { step } from '../../utils/decorators';
import { ButtonsPage } from './buttons-page';

/**
 * Buttons Page verification class
 */
export class ButtonsPageVerify {
  constructor(protected readonly page: ButtonsPage) {}

  @step('Verify button action message appears')
  async actionMessageAppears(): Promise<void> {
    await expect(this.page.locators.messages).toBeVisible();
  }

  @step('Verify message contains "{{args[0]}}"')
  async messageContains(text: string): Promise<void> {
    await expect(this.page.locators.messages).toContainText(text);
  }

  override toString(): string {
    return 'Buttons Page';
  }
}
