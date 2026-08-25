import { test, expect, Authors, Priorities } from '../fixtures';
import { faker } from '@faker-js/faker';

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
      // #region Arrange
      const fullName = faker.person.fullName();
      const email = faker.internet.email();
      const currentAddress = faker.location.streetAddress();
      const permanentAddress = faker.location.streetAddress();

      await test.step('1. Navigate to the Text Box page', async () => {
        await demoQA.sidebar.expandSection('Elements');
        await demoQA.sidebar.navigateToPage('text-box');
        await demoQA.textBoxPage.waitForForm();
      });
      // #endregion

      // #region Act
      await test.step('2. Fill in the Full Name, Email, Current Address, and Permanent Address fields', async () => {
        await demoQA.textBoxPage.fullNameField.typeText(fullName);
        await demoQA.textBoxPage.emailField.typeText(email);
        await demoQA.textBoxPage.currentAddressField.typeText(currentAddress);
        await demoQA.textBoxPage.permanentAddressField.typeText(permanentAddress);
      });

      await test.step('3. Submit the form', async () => {
        await demoQA.textBoxPage.submit();
      });
      // #endregion

      // #region Assert
      await test.step('4. Verify that the output contains the entered values', async () => {
        await demoQA.textBoxPage.verify.outputContains(fullName);
        await demoQA.textBoxPage.verify.outputContains(email);
        await demoQA.textBoxPage.verify.outputContains(currentAddress);
        await demoQA.textBoxPage.verify.outputContains(permanentAddress);
      });
      // #endregion
    }
  );
});
