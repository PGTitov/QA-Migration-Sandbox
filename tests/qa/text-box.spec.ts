import { test, Authors, Priorities } from '../fixtures';
import { faker } from '@faker-js/faker';
import { getUrl, testConfig } from '../../config';

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
        await page.goto(getUrl(testConfig.pages.textBox), {
          waitUntil: 'domcontentloaded',
        });
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
        await demoQA.textBoxPage.verify.outputIsVisible();
        await demoQA.textBoxPage.verify.outputContainsName(fullName);
        await demoQA.textBoxPage.verify.outputContainsEmail(email);
        await demoQA.textBoxPage.verify.outputContains(fullName);
        await demoQA.textBoxPage.verify.outputContains(email);
        await demoQA.textBoxPage.verify.outputContains(currentAddress);
        await demoQA.textBoxPage.verify.outputContains(permanentAddress);
      });
      // #endregion
    }
  );

  test(
    '[TEST-2] Verify empty submission does not populate output',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'TEST-2' },
        { type: 'priority', description: Priorities.High },
      ],
    },
    async ({ demoQA, page }) => {
      // #region Arrange
      await test.step('1. Navigate to the Text Box page', async () => {
        await page.goto(getUrl(testConfig.pages.textBox), {
          waitUntil: 'domcontentloaded',
        });
        await demoQA.textBoxPage.waitForForm();
      });
      // #endregion

      // #region Act
      await test.step('2. Submit the empty form', async () => {
        await demoQA.textBoxPage.submit();
      });
      // #endregion

      // #region Assert
      await test.step('3. Verify the fields remain empty and no output is shown', async () => {
        await demoQA.textBoxPage.fullNameField.verify.hasValue('');
        await demoQA.textBoxPage.emailField.verify.hasValue('');
        await demoQA.textBoxPage.verify.output.visible(false);
      });
      // #endregion
    }
  );

  test(
    '[TEST-3] Verify invalid email prevents submission',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'TEST-3' },
        { type: 'priority', description: Priorities.High },
      ],
    },
    async ({ demoQA, page }) => {
      // #region Arrange
      const fullName = faker.person.fullName();

      await test.step('1. Navigate to the Text Box page', async () => {
        await page.goto(getUrl(testConfig.pages.textBox), {
          waitUntil: 'domcontentloaded',
        });
        await demoQA.textBoxPage.waitForForm();
      });
      // #endregion

      // #region Act
      await test.step('2. Enter a name and an invalid email address, then submit', async () => {
        await demoQA.textBoxPage.fullNameField.typeText(fullName);
        await demoQA.textBoxPage.emailField.typeText('invalid-email');
        await demoQA.textBoxPage.submit();
      });
      // #endregion

      // #region Assert
      await test.step('3. Verify the email field is invalid and no output is shown', async () => {
        await demoQA.textBoxPage.verify.emailIsInvalid();
        await demoQA.textBoxPage.verify.emailHasErrorBorder();
        await demoQA.textBoxPage.verify.emailValidationMessageIs();
        await demoQA.textBoxPage.verify.output.visible(false);
      });
      // #endregion
    }
  );

  test(
    '[TEST-4] Verify optional address fields can be omitted',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'TEST-4' },
        { type: 'priority', description: Priorities.Medium },
      ],
    },
    async ({ demoQA, page }) => {
      // #region Arrange
      const fullName = faker.person.fullName();
      const email = faker.internet.email();

      await test.step('1. Navigate to the Text Box page', async () => {
        await page.goto(getUrl(testConfig.pages.textBox), {
          waitUntil: 'domcontentloaded',
        });
        await demoQA.textBoxPage.waitForForm();
      });
      // #endregion

      // #region Act
      await test.step('2. Fill only the required fields and submit the form', async () => {
        await demoQA.textBoxPage.fillForm(fullName, email);
        await demoQA.textBoxPage.submit();
      });
      // #endregion

      // #region Assert
      await test.step('3. Verify the submission contains the required values', async () => {
        await demoQA.textBoxPage.verify.outputIsVisible();
        await demoQA.textBoxPage.verify.outputContainsName(fullName);
        await demoQA.textBoxPage.verify.outputContainsEmail(email);
      });
      // #endregion
    }
  );

  test(
    '[TEST-5] Verify special characters are preserved',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'TEST-5' },
        { type: 'priority', description: Priorities.Medium },
      ],
    },
    async ({ demoQA, page }) => {
      // #region Arrange
      const fullName = "O'Connor & Sons";
      const email = 'qa.text.box@example.co.uk';
      const currentAddress = '123/45-A #7';
      const permanentAddress = '"Quoted" Street';

      await test.step('1. Navigate to the Text Box page', async () => {
        await page.goto(getUrl(testConfig.pages.textBox), {
          waitUntil: 'domcontentloaded',
        });
        await demoQA.textBoxPage.waitForForm();
      });
      // #endregion

      // #region Act
      await test.step('2. Fill and submit the form with special characters', async () => {
        await demoQA.textBoxPage.fillForm(
          fullName,
          email,
          currentAddress,
          permanentAddress
        );
        await demoQA.textBoxPage.submit();
      });
      // #endregion

      // #region Assert
      await test.step('3. Verify special characters are preserved in the output', async () => {
        await demoQA.textBoxPage.verify.output.visible();
        await demoQA.textBoxPage.verify.outputContainsName(fullName);
        await demoQA.textBoxPage.verify.outputContainsEmail(email);
        await demoQA.textBoxPage.verify.outputContains(currentAddress);
        await demoQA.textBoxPage.verify.outputContains(permanentAddress);
      });
      // #endregion
    }
  );

  test(
    '[TEST-6] Verify Unicode and multiline addresses are preserved',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'TEST-6' },
        { type: 'priority', description: Priorities.Medium },
      ],
    },
    async ({ demoQA, page }) => {
      // #region Arrange
      const fullName = 'Тест Жанна';
      const email = 'qa.unicode@example.com';
      const currentAddress = 'вул. Тестова, д. 42\nКвартира 7';
      const permanentAddress = '東京\n〒100-0001';

      await test.step('1. Navigate to the Text Box page', async () => {
        await page.goto(getUrl(testConfig.pages.textBox), {
          waitUntil: 'domcontentloaded',
        });
        await demoQA.textBoxPage.waitForForm();
      });
      // #endregion

      // #region Act
      await test.step('2. Fill and submit the form with Unicode and multiline values', async () => {
        await demoQA.textBoxPage.fillForm(
          fullName,
          email,
          currentAddress,
          permanentAddress
        );
        await demoQA.textBoxPage.submit();
      });
      // #endregion

      // #region Assert
      await test.step('3. Verify Unicode and multiline values are preserved in the output', async () => {
        await demoQA.textBoxPage.verify.output.visible();
        await demoQA.textBoxPage.verify.outputContainsName(fullName);
        await demoQA.textBoxPage.verify.outputContainsEmail(email);
        await demoQA.textBoxPage.verify.outputContains(currentAddress);
        await demoQA.textBoxPage.verify.outputContains(permanentAddress);
      });
      // #endregion
    }
  );

  test(
    '[TEST-7] Verify address fields can be resized vertically',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'TEST-7' },
        { type: 'priority', description: Priorities.Medium },
      ],
    },
    async ({ demoQA, page }) => {
      // #region Arrange
      await test.step('1. Navigate to the Text Box page', async () => {
        await page.goto(getUrl(testConfig.pages.textBox), {
          waitUntil: 'domcontentloaded',
        });
        await demoQA.textBoxPage.waitForForm();
      });
      // #endregion

      // #region Assert
      await test.step('2. Verify both address fields can be resized vertically', async () => {
        await demoQA.textBoxPage.verify.addressFieldCanBeResizedVertically(
          'currentAddress'
        );
        await demoQA.textBoxPage.verify.addressFieldCanBeResizedVertically(
          'permanentAddress'
        );
      });
      // #endregion
    }
  );

  test(
    '[TEST-8] Verify focus styling and Tab navigation for address fields',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'TEST-8' },
        { type: 'priority', description: Priorities.Medium },
      ],
    },
    async ({ demoQA, page }) => {
      // #region Arrange
      await test.step('1. Navigate to the Text Box page', async () => {
        await page.goto(getUrl(testConfig.pages.textBox), {
          waitUntil: 'domcontentloaded',
        });
        await demoQA.textBoxPage.waitForForm();
      });
      // #endregion

      // #region Act
      await test.step('2. Focus Current Address and press Tab', async () => {
        await demoQA.textBoxPage.currentAddressField.click();
        await demoQA.textBoxPage.verify.addressFieldIsFocused('currentAddress');
        await demoQA.textBoxPage.verify.addressFieldHasBlueFocusBorder(
          'currentAddress'
        );
        await demoQA.textBoxPage.pressTab();
      });
      // #endregion

      // #region Assert
      await test.step('3. Verify focus moves to Permanent Address with the blue focus border', async () => {
        await demoQA.textBoxPage.verify.addressFieldIsFocused('permanentAddress');
        await demoQA.textBoxPage.verify.addressFieldHasBlueFocusBorder(
          'permanentAddress'
        );
      });
      // #endregion
    }
  );
});
