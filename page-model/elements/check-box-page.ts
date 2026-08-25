import { Page, Locator } from '@playwright/test';
import { CheckBox } from '../controls/check-box';
import { CheckBoxPageVerify } from './check-box-page-verify';
import { step } from '../../utils/decorators';

/**
 * CheckBox Page Model
 */
export class CheckBoxPage {
  readonly verify: CheckBoxPageVerify;
  readonly locators: {
    root: Locator;
    expandAllButton: Locator;
    collapseAllButton: Locator;
    treeView: Locator;
    resultsSection: Locator;
  };

  constructor(protected readonly page: Page) {
    this.locators = {
      root: this.page.locator('app-checkbox'),
      expandAllButton: this.page.locator('button:text("Expand All")'),
      collapseAllButton: this.page.locator('button:text("Collapse All")'),
      treeView: this.page.getByRole('tree'),
      resultsSection: this.page.locator('#result'),
    };
    this.verify = new CheckBoxPageVerify(this);
  }

  @step('Expand all checkbox items')
  async expandAll(): Promise<void> {
    await this.locators.expandAllButton.click();
  }

  @step('Collapse all checkbox items')
  async collapseAll(): Promise<void> {
    await this.locators.collapseAllButton.click();
  }

  @step('Check item "{{args[0]}}"')
  async checkItem(itemLabel: string): Promise<void> {
    await this.getItemCheckbox(itemLabel).check();
  }

  @step('Uncheck item "{{args[0]}}"')
  async uncheckItem(itemLabel: string): Promise<void> {
    await this.getItemCheckbox(itemLabel).uncheck();
  }

  @step('Get selected items')
  async getSelectedItems(): Promise<string[]> {
    const items = await this.page
      .locator('.mt-4 span.text-success')
      .allTextContents();
    return items.map((item) => item.trim());
  }

  private getItemCheckbox(itemLabel: string): CheckBox {
    const itemCheckbox = this.page
      .getByRole('treeitem', { name: new RegExp(itemLabel, 'i') })
      .getByRole('checkbox');
    return new CheckBox(itemCheckbox, itemLabel);
  }

  toString(): string {
    return 'CheckBox Page';
  }
}
