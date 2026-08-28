import { expect } from '@playwright/test';
import { step } from '../../utils/decorators';
import { DynamicPropertiesPage } from './dynamic-properties-page';

/**
 * Dynamic Properties Page verification class
 */
export class DynamicPropertiesPageVerify {
  constructor(protected readonly page: DynamicPropertiesPage) {}

  @step('Verify the enable-after button is disabled')
  async enableAfterButtonIsDisabled(isDisabled: boolean = true): Promise<void> {
    if (isDisabled) {
      await expect(this.page.locators.enableAfterButton).toBeDisabled();
    } else {
      await expect(this.page.locators.enableAfterButton).toBeEnabled({ timeout: 8000 });
    }
  }

  @step('Verify the color-change button does not have the danger color yet')
  async colorChangeButtonHasDangerColor(hasDangerColor: boolean = true): Promise<void> {
    if (hasDangerColor) {
      await expect(this.page.locators.colorChangeButton).toHaveClass(/text-danger/, {
        timeout: 8000,
      });
    } else {
      await expect(this.page.locators.colorChangeButton).not.toHaveClass(/text-danger/);
    }
  }

  @step('Verify the visible-after button is visible')
  async visibleAfterButtonIsVisible(isVisible: boolean = true): Promise<void> {
    if (isVisible) {
      await expect(this.page.locators.visibleAfterButton).toBeVisible({ timeout: 8000 });
    } else {
      await expect(this.page.locators.visibleAfterButton).toHaveCount(0);
    }
  }

  toString(): string {
    return 'Dynamic Properties Page';
  }
}
