import { test, expect } from '../fixtures';
import { getUrl, testConfig } from '../../config';

test.describe('DemoQA Text Box page', () => {
  test('fills the form and verifies the submitted values', async ({ demoQA, page }) => {
    const fullName = 'Alice Johnson';
    const email = 'alice@example.com';
    const currentAddress = '123 Main Street';
    const permanentAddress = '456 Oak Avenue';

    await page.goto(getUrl(testConfig.pages.elements), { waitUntil: 'domcontentloaded' });

    await demoQA.sidebar.expandSection('Elements');
    await demoQA.sidebar.navigateToPage('text-box');
    await page.locator('#userForm').waitFor({ state: 'visible' });

    await demoQA.textBoxPage.fullNameField.typeText(fullName);
    await demoQA.textBoxPage.emailField.typeText(email);
    await demoQA.textBoxPage.currentAddressField.typeText(currentAddress);
    await demoQA.textBoxPage.permanentAddressField.typeText(permanentAddress);

    await demoQA.textBoxPage.submit();

    await expect(page.locator('#output')).toContainText(fullName);
    await expect(page.locator('#output')).toContainText(email);
    await expect(page.locator('#output')).toContainText(currentAddress);
    await expect(page.locator('#output')).toContainText(permanentAddress);
  });
});
