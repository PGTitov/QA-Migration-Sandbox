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
    const resultItem = this.page.locators.resultsSection.getByText(itemLabel, {
      exact: true,
    });
    await expect(resultItem).toBeVisible();
  }

  @step('Verify item "{{args[0]}}" is not selected')
  async itemIsNotSelected(itemLabel: string): Promise<void> {
    const resultItem = this.page.locators.resultsSection.getByText(itemLabel, {
      exact: true,
    });
    await expect(resultItem).toHaveCount(0);
  }

  @step('Verify tree view is visible')
  async treeViewIsVisible(): Promise<void> {
    await expect(this.page.locators.treeView).toBeVisible();
  }

  toString(): string {
    return 'CheckBox Page';
  }
}
