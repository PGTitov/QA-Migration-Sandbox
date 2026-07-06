import { expect } from '@playwright/test';
import { step } from '../../utils/decorators';
import { CheckBoxPage } from './check-box-page';

/**
 * CheckBox Page verification class
 */
export class CheckBoxPageVerify {
  constructor(protected readonly page: CheckBoxPage) {}

  @step('Verify item "{{args[0]}}" is selected')
  async itemIsSelected(itemLabel: string): Promise<void> {
    const resultText = this.page.locators.resultsSection;
    await expect(resultText).toContainText(itemLabel);
  }

  @step('Verify tree view is visible')
  async treeViewIsVisible(): Promise<void> {
    await expect(this.page.locators.treeView).toBeVisible();
  }

  override toString(): string {
    return 'CheckBox Page';
  }
}
