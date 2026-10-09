import { test } from '../fixtures';
import { getUrl, testConfig } from '../../config';

test.describe('DemoQA Date Picker page', () => {
  test('selecting a day updates the date field', async ({ demoQA, page }) => {
    await page.goto(getUrl(testConfig.pages.widgets.datePicker), {
      waitUntil: 'domcontentloaded',
    });

    await demoQA.datePickerPage.setDate('12/25/2025');
    await demoQA.datePickerPage.openDatePicker();
    await demoQA.datePickerPage.verify.datePickerIsVisible();
    await demoQA.datePickerPage.selectDateInPicker('15');

    await demoQA.datePickerPage.verify.dateInputHasValue('12/15/2025');
  });
});