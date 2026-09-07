import { expect } from '@playwright/test';
import { step } from '../../utils/decorators';
import { WebTableField, WebTablesPage } from './web-tables-page';

/**
 * Web Tables Page verification class
 */
export class WebTablesPageVerify {
  constructor(protected readonly page: WebTablesPage) {}

  @step('Verify row with email "{{args[0]}}" is visible')
  async rowIsVisible(email: string, isVisible: boolean = true): Promise<void> {
    const row = this.page.getRowByEmail(email);
    if (isVisible) {
      await expect(row).toBeVisible();
    } else {
      await expect(row).toHaveCount(0);
    }
  }

  @step('Verify row with email "{{args[0]}}" contains "{{args[1]}}"')
  async rowContains(email: string, expectedText: string): Promise<void> {
    await expect(this.page.getRowByEmail(email)).toContainText(expectedText);
  }

  @step('Verify table row count is {{args[0]}}')
  async rowCountIs(count: number): Promise<void> {
    await expect(this.page.locators.rows).toHaveCount(count);
  }

  @step('Verify the registration form is visible')
  async formIsVisible(isVisible: boolean = true): Promise<void> {
    if (isVisible) {
      await expect(this.page.locators.modal).toBeVisible();
    } else {
      await expect(this.page.locators.modal).not.toBeVisible();
    }
  }

  @step('Verify {{args[0]}} field is marked invalid')
  async fieldIsInvalid(field: WebTableField): Promise<void> {
    await expect(this.page.getFieldLocator(field)).toHaveCSS(
      'border-color',
      'rgb(220, 53, 69)'
    );
  }

  toString(): string {
    return 'Web Tables Page';
  }
}
