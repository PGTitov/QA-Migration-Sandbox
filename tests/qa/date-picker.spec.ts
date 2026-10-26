import { test } from '../fixtures';

test.describe('DemoQA Date Picker page', () => {
  test.beforeEach(async ({ demoQA }) => {
    await demoQA.datePickerPage.open();
  });

  test('selecting a day updates the date field', async ({ demoQA }) => {
    const expectedDate1 = '12/10/2025';
    const expectedDate2 = '12/15/2025';

    await test.step('1. Set and verify the initial date', async () => {
      await demoQA.datePickerPage.setDate(expectedDate1);
      await demoQA.datePickerPage.verify.dateInputHasValue(expectedDate1);
    });

    await test.step('2. Select a different day from the date picker', async () => {
      await demoQA.datePickerPage.openDatePicker();
      await demoQA.datePickerPage.verify.datePickerIsVisible();
      await demoQA.datePickerPage.selectDateInPicker('15');
    });

    await test.step('3. Verify the selected date', async () => {
      await demoQA.datePickerPage.verify.dateInputHasValue(expectedDate2);
    });
  });
});