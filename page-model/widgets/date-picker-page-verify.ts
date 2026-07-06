import { expect } from '@playwright/test';
import { step } from '../../utils/decorators';
import { DatePickerPage } from './date-picker-page';

/**
 * Date Picker Page verification class
 */
export class DatePickerPageVerify {
  constructor(protected readonly page: DatePickerPage) {}

  @step('Verify date input has value "{{args[0]}}"')
  async dateInputHasValue(expectedDate: string): Promise<void> {
    await expect(this.page.locators.dateInput).toHaveValue(expectedDate);
  }

  @step('Verify date picker is visible')
  async datePickerIsVisible(): Promise<void> {
    await expect(this.page.locators.datePickerContainer).toBeVisible();
  }

  override toString(): string {
    return 'Date Picker Page';
  }
}
