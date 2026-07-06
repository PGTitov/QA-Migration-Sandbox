import { test, expect, Authors, Priorities } from '../fixtures';

test.describe('DemoQA Text Box page', () => {
  test(
    '[TEST-1] Verify the Textbox',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'TEST-1' },
        { type: 'priority', description: Priorities.Medium },
      ],
    },
    async ({ demoQA, page }) => {
    const fullName = 'Alice Johnson';
    const email = 'alice@example.com';
    const currentAddress = '123 Main Street';
    const permanentAddress = '456 Oak Avenue';

    await demoQA.sidebar.expandSection('Elements');
    await demoQA.sidebar.navigateToPage('text-box');
    await demoQA.textBoxPage.waitForForm();

    await demoQA.textBoxPage.fullNameField.typeText(fullName);
    await demoQA.textBoxPage.emailField.typeText(email);
    await demoQA.textBoxPage.currentAddressField.typeText(currentAddress);
    await demoQA.textBoxPage.permanentAddressField.typeText(permanentAddress);

    await demoQA.textBoxPage.submit();

    await demoQA.textBoxPage.verify.outputContains(fullName);
    await demoQA.textBoxPage.verify.outputContains(email);
    await demoQA.textBoxPage.verify.outputContains(currentAddress);
    await demoQA.textBoxPage.verify.outputContains(permanentAddress);
    }
  );
});
