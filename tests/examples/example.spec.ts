import { test, expect } from '../fixtures';
import { getUrl, testConfig } from '../../config';

/**
 * Example tests demonstrating DemoQA page model usage
 */

test.describe('DemoQA - Elements', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(getUrl(testConfig.pages.textBox));
  });

  test('should fill and submit text box form', async ({ demoQA }) => {
    // Access TextBoxPage through facade
    await demoQA.textBoxPage.fillForm(
      'John Doe',
      'john@example.com',
      '123 Main St',
      '456 Oak Ave'
    );
    await demoQA.textBoxPage.submit();

    // Verify the submission using the verify class
    await demoQA.textBoxPage.verify.outputContainsName('John Doe');
    await demoQA.textBoxPage.verify.outputContainsEmail('john@example.com');
  });
});

test.describe('DemoQA - Widgets', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(getUrl(testConfig.pages.widgets.slider));
  });

  test('should set slider value', async ({ demoQA }) => {
    await demoQA.sliderPage.setSliderValue('50');
    await demoQA.sliderPage.verify.sliderValueIs('50');
  });
});

test.describe('DemoQA - Forms', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(getUrl(testConfig.pages.forms));
  });

  test('should fill practice form', async ({ demoQA }) => {
    await demoQA.practiceFormPage.fillBasicInfo('Jane', 'Smith');
    await demoQA.practiceFormPage.selectGender('female');
    await demoQA.practiceFormPage.enterMobileNumber('1234567890');
    await demoQA.practiceFormPage.submit();

    // Verify submission
    await demoQA.practiceFormPage.verify.successMessageAppears();
  });
});

test.describe('DemoQA - Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(getUrl(testConfig.pages.elements));
  });

  test('should navigate using sidebar', async ({ demoQA }) => {
    await demoQA.sidebar.navigateToPage('text-box');
    // Verify page is loaded
    expect(demoQA.page.url()).toContain('text-box');
  });

  test('should toggle sidebar menu', async ({ demoQA }) => {
    await demoQA.sidebar.toggleMenu();
    await demoQA.sidebar.verify.isVisible();
  });
});
