import { Page, Locator } from '@playwright/test';
import { DatePickerPageVerify } from './date-picker-page-verify';
import { step } from '../../utils/decorators';

/**
 * Date Picker Page Model
 */
export class DatePickerPage {
  readonly verify: DatePickerPageVerify;
  readonly locators: {
    root: Locator;
    dateInput: Locator;
    dateTimeInput: Locator;
    datePickerContainer: Locator;
  };

  constructor(protected readonly page: Page) {
    this.locators = {
      root: this.page.locator('app-date-picker'),
      dateInput: this.page.locator('#datePickerMonthYearInput'),
      dateTimeInput: this.page.locator('#dateAndTimePickerInput'),
      datePickerContainer: this.page.locator('.react-datepicker'),
    };
    this.verify = new DatePickerPageVerify(this);
  }

  @step('Click date picker input')
  async openDatePicker(): Promise<void> {
    await this.locators.dateInput.click();
  }

  @step('Set date to "{{args[0]}}"')
  async setDate(date: string): Promise<void> {
    await this.locators.dateInput.fill(date);
    await this.locators.dateInput.press('Enter');
  }

  @step('Click date "{{args[0]}}" in picker')
  async selectDateInPicker(dayNumber: string): Promise<void> {
    const dateButton = this.page.locator(
      `.react-datepicker__day:text("${dayNumber}"):not(.react-datepicker__day--outside-month)`
    );
    await dateButton.click();
  }

  override toString(): string {
    return 'Date Picker Page';
  }
}
