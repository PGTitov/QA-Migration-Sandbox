import { test, Authors, Priorities } from '../fixtures';
import { faker } from '@faker-js/faker';
import { getUrl, testConfig } from '../../config';
import { WebTableRecord } from '../../page-model/elements';

test.describe('DemoQA Web Tables page', () => {
  test(
    '[TEST-16] Verify adding a new record displays it in the table',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'TEST-16' },
        { type: 'priority', description: Priorities.High },
      ],
    },
    async ({ demoQA, page }) => {
      // #region Arrange
      const record: WebTableRecord = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        age: '28',
        salary: '50000',
        department: 'QA',
      };

      await test.step('1. Navigate to the Web Tables page', async () => {
        await page.goto(getUrl(testConfig.pages.webTables), {
          waitUntil: 'domcontentloaded',
        });
      });
      // #endregion

      // #region Act
      await test.step('2. Add a new record', async () => {
        await demoQA.webTablesPage.addRecord(record);
      });
      // #endregion

      // #region Assert
      await test.step('3. Verify the new record is displayed in the table', async () => {
        await demoQA.webTablesPage.verify.rowIsVisible(record.email);
        await demoQA.webTablesPage.verify.rowContains(
          record.email,
          record.firstName
        );
        await demoQA.webTablesPage.verify.rowContains(
          record.email,
          record.lastName
        );
      });
      // #endregion
    }
  );

  test(
    '[TEST-17] Verify empty form submission does not add a record',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'TEST-17' },
        { type: 'priority', description: Priorities.High },
      ],
    },
    async ({ demoQA, page }) => {
      // #region Arrange
      await test.step('1. Navigate to the Web Tables page and open the Add form', async () => {
        await page.goto(getUrl(testConfig.pages.webTables), {
          waitUntil: 'domcontentloaded',
        });
        await demoQA.webTablesPage.openAddNewRecordForm();
      });
      // #endregion

      // #region Act
      await test.step('2. Submit the form without filling any fields', async () => {
        await demoQA.webTablesPage.submitForm();
      });
      // #endregion

      // #region Assert
      await test.step('3. Verify the form stays open because required fields are missing', async () => {
        await demoQA.webTablesPage.verify.formIsVisible();
      });
      // #endregion
    }
  );

  test(
    '[TEST-18] Verify invalid email prevents form submission',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'TEST-18' },
        { type: 'priority', description: Priorities.High },
      ],
    },
    async ({ demoQA, page }) => {
      // #region Arrange
      await test.step('1. Navigate to the Web Tables page and open the Add form', async () => {
        await page.goto(getUrl(testConfig.pages.webTables), {
          waitUntil: 'domcontentloaded',
        });
        await demoQA.webTablesPage.openAddNewRecordForm();
      });
      // #endregion

      // #region Act
      await test.step('2. Fill the form with an invalid email and submit', async () => {
        await demoQA.webTablesPage.fillForm({
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: 'not-an-email',
        });
        await demoQA.webTablesPage.submitForm();
      });
      // #endregion

      // #region Assert
      await test.step('3. Verify the form stays open because the email is invalid', async () => {
        await demoQA.webTablesPage.verify.formIsVisible();
      });
      // #endregion
    }
  );

  test(
    '[TEST-19] Verify editing a record updates its details in the table',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'TEST-19' },
        { type: 'priority', description: Priorities.Medium },
      ],
    },
    async ({ demoQA, page }) => {
      // #region Arrange
      const originalRecord: WebTableRecord = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        age: '30',
        salary: '40000',
        department: 'QA',
      };
      const updatedRecord: WebTableRecord = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        age: '31',
        salary: '45000',
        department: 'Support',
      };

      await test.step('1. Navigate to the Web Tables page and add a record', async () => {
        await page.goto(getUrl(testConfig.pages.webTables), {
          waitUntil: 'domcontentloaded',
        });
        await demoQA.webTablesPage.addRecord(originalRecord);
        await demoQA.webTablesPage.verify.rowIsVisible(originalRecord.email);
      });
      // #endregion

      // #region Act
      await test.step('2. Edit the record with new details', async () => {
        await demoQA.webTablesPage.editRecord(
          originalRecord.email,
          updatedRecord
        );
      });
      // #endregion

      // #region Assert
      await test.step('3. Verify the table shows the updated record and not the original', async () => {
        await demoQA.webTablesPage.verify.rowIsVisible(updatedRecord.email);
        await demoQA.webTablesPage.verify.rowContains(
          updatedRecord.email,
          updatedRecord.firstName
        );
        await demoQA.webTablesPage.verify.rowIsVisible(
          originalRecord.email,
          false
        );
      });
      // #endregion
    }
  );

  test(
    '[TEST-20] Verify deleting a record removes it from the table',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'TEST-20' },
        { type: 'priority', description: Priorities.Medium },
      ],
    },
    async ({ demoQA, page }) => {
      // #region Arrange
      const record: WebTableRecord = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        age: '30',
        salary: '40000',
        department: 'QA',
      };

      await test.step('1. Navigate to the Web Tables page and add a record', async () => {
        await page.goto(getUrl(testConfig.pages.webTables), {
          waitUntil: 'domcontentloaded',
        });
        await demoQA.webTablesPage.addRecord(record);
        await demoQA.webTablesPage.verify.rowIsVisible(record.email);
      });
      // #endregion

      // #region Act
      await test.step('2. Delete the record', async () => {
        await demoQA.webTablesPage.deleteRecord(record.email);
      });
      // #endregion

      // #region Assert
      await test.step('3. Verify the record is no longer in the table', async () => {
        await demoQA.webTablesPage.verify.rowIsVisible(record.email, false);
      });
      // #endregion
    }
  );

  test(
    '[TEST-21] Verify searching filters the table to matching records',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'TEST-21' },
        { type: 'priority', description: Priorities.Medium },
      ],
    },
    async ({ demoQA, page }) => {
      // #region Arrange
      const record: WebTableRecord = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        age: '30',
        salary: '40000',
        department: 'QA',
      };

      await test.step('1. Navigate to the Web Tables page and add a record', async () => {
        await page.goto(getUrl(testConfig.pages.webTables), {
          waitUntil: 'domcontentloaded',
        });
        await demoQA.webTablesPage.addRecord(record);
        await demoQA.webTablesPage.verify.rowIsVisible(record.email);
      });
      // #endregion

      // #region Act
      await test.step('2. Search using the new record email', async () => {
        await demoQA.webTablesPage.search(record.email);
      });
      // #endregion

      // #region Assert
      await test.step('3. Verify only the matching record is shown', async () => {
        await demoQA.webTablesPage.verify.rowIsVisible(record.email);
        await demoQA.webTablesPage.verify.rowCountIs(1);
      });
      // #endregion
    }
  );

  test(
    '[TEST-22] Verify searching for a non-existent record returns no rows',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'TEST-22' },
        { type: 'priority', description: Priorities.Low },
      ],
    },
    async ({ demoQA, page }) => {
      // #region Arrange
      await test.step('1. Navigate to the Web Tables page', async () => {
        await page.goto(getUrl(testConfig.pages.webTables), {
          waitUntil: 'domcontentloaded',
        });
      });
      // #endregion

      // #region Act
      await test.step('2. Search for an email that does not exist', async () => {
        await demoQA.webTablesPage.search('no-such-record@example.com');
      });
      // #endregion

      // #region Assert
      await test.step('3. Verify no rows are displayed', async () => {
        await demoQA.webTablesPage.verify.rowCountIs(0);
      });
      // #endregion
    }
  );

  test(
    '[TEST-23] Verify submitting the form without a First Name is rejected',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'TEST-23' },
        { type: 'priority', description: Priorities.High },
      ],
    },
    async ({ demoQA, page }) => {
      // #region Arrange
      const email = faker.internet.email();

      await test.step('1. Navigate to the Web Tables page and open the Add form', async () => {
        await page.goto(getUrl(testConfig.pages.webTables), {
          waitUntil: 'domcontentloaded',
        });
        await demoQA.webTablesPage.openAddNewRecordForm();
      });
      // #endregion

      // #region Act
      await test.step('2. Fill all fields except First Name and submit', async () => {
        await demoQA.webTablesPage.lastNameField.typeText(
          faker.person.lastName()
        );
        await demoQA.webTablesPage.emailField.typeText(email);
        await demoQA.webTablesPage.ageField.typeText('30');
        await demoQA.webTablesPage.salaryField.typeText('40000');
        await demoQA.webTablesPage.departmentField.typeText('QA');
        await demoQA.webTablesPage.submitForm();
      });
      // #endregion

      // #region Assert
      await test.step('3. Verify the form stays open, First Name is marked invalid, and no record is added', async () => {
        await demoQA.webTablesPage.verify.formIsVisible();
        await demoQA.webTablesPage.verify.fieldIsInvalid('firstName');
        await demoQA.webTablesPage.closeForm();
        await demoQA.webTablesPage.verify.rowIsVisible(email, false);
      });
      // #endregion
    }
  );

  test(
    '[TEST-24] Verify submitting the form without a Last Name is rejected',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'TEST-24' },
        { type: 'priority', description: Priorities.High },
      ],
    },
    async ({ demoQA, page }) => {
      // #region Arrange
      const email = faker.internet.email();

      await test.step('1. Navigate to the Web Tables page and open the Add form', async () => {
        await page.goto(getUrl(testConfig.pages.webTables), {
          waitUntil: 'domcontentloaded',
        });
        await demoQA.webTablesPage.openAddNewRecordForm();
      });
      // #endregion

      // #region Act
      await test.step('2. Fill all fields except Last Name and submit', async () => {
        await demoQA.webTablesPage.firstNameField.typeText(
          faker.person.firstName()
        );
        await demoQA.webTablesPage.emailField.typeText(email);
        await demoQA.webTablesPage.ageField.typeText('30');
        await demoQA.webTablesPage.salaryField.typeText('40000');
        await demoQA.webTablesPage.departmentField.typeText('QA');
        await demoQA.webTablesPage.submitForm();
      });
      // #endregion

      // #region Assert
      await test.step('3. Verify the form stays open, Last Name is marked invalid, and no record is added', async () => {
        await demoQA.webTablesPage.verify.formIsVisible();
        await demoQA.webTablesPage.verify.fieldIsInvalid('lastName');
        await demoQA.webTablesPage.closeForm();
        await demoQA.webTablesPage.verify.rowIsVisible(email, false);
      });
      // #endregion
    }
  );

  test(
    '[TEST-25] Verify submitting the form without an Email is rejected',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'TEST-25' },
        { type: 'priority', description: Priorities.High },
      ],
    },
    async ({ demoQA, page }) => {
      // #region Arrange
      await test.step('1. Navigate to the Web Tables page and open the Add form', async () => {
        await page.goto(getUrl(testConfig.pages.webTables), {
          waitUntil: 'domcontentloaded',
        });
        await demoQA.webTablesPage.openAddNewRecordForm();
      });
      // #endregion

      // #region Act
      await test.step('2. Fill all fields except Email and submit', async () => {
        await demoQA.webTablesPage.firstNameField.typeText(
          faker.person.firstName()
        );
        await demoQA.webTablesPage.lastNameField.typeText(
          faker.person.lastName()
        );
        await demoQA.webTablesPage.ageField.typeText('30');
        await demoQA.webTablesPage.salaryField.typeText('40000');
        await demoQA.webTablesPage.departmentField.typeText('QA');
        await demoQA.webTablesPage.submitForm();
      });
      // #endregion

      // #region Assert
      await test.step('3. Verify the form stays open and Email is marked invalid', async () => {
        await demoQA.webTablesPage.verify.formIsVisible();
        await demoQA.webTablesPage.verify.fieldIsInvalid('email');
      });
      // #endregion
    }
  );

  test(
    '[TEST-26] Verify a non-numeric Age is rejected on submission',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'TEST-26' },
        { type: 'priority', description: Priorities.Medium },
      ],
    },
    async ({ demoQA, page }) => {
      // #region Arrange
      const email = faker.internet.email();

      await test.step('1. Navigate to the Web Tables page and open the Add form', async () => {
        await page.goto(getUrl(testConfig.pages.webTables), {
          waitUntil: 'domcontentloaded',
        });
        await demoQA.webTablesPage.openAddNewRecordForm();
      });
      // #endregion

      // #region Act
      await test.step('2. Fill the form with a non-numeric Age and submit', async () => {
        await demoQA.webTablesPage.firstNameField.typeText(
          faker.person.firstName()
        );
        await demoQA.webTablesPage.lastNameField.typeText(
          faker.person.lastName()
        );
        await demoQA.webTablesPage.emailField.typeText(email);
        await demoQA.webTablesPage.ageField.typeText('abc');
        await demoQA.webTablesPage.salaryField.typeText('40000');
        await demoQA.webTablesPage.departmentField.typeText('QA');
        await demoQA.webTablesPage.submitForm();
      });
      // #endregion

      // #region Assert
      await test.step('3. Verify the form stays open, Age is marked invalid, and no record is added', async () => {
        await demoQA.webTablesPage.verify.formIsVisible();
        await demoQA.webTablesPage.verify.fieldIsInvalid('age');
        await demoQA.webTablesPage.closeForm();
        await demoQA.webTablesPage.verify.rowIsVisible(email, false);
      });
      // #endregion
    }
  );

  test(
    '[TEST-27] Verify a non-numeric Salary is rejected on submission',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'TEST-27' },
        { type: 'priority', description: Priorities.Medium },
      ],
    },
    async ({ demoQA, page }) => {
      // #region Arrange
      const email = faker.internet.email();

      await test.step('1. Navigate to the Web Tables page and open the Add form', async () => {
        await page.goto(getUrl(testConfig.pages.webTables), {
          waitUntil: 'domcontentloaded',
        });
        await demoQA.webTablesPage.openAddNewRecordForm();
      });
      // #endregion

      // #region Act
      await test.step('2. Fill the form with a non-numeric Salary and submit', async () => {
        await demoQA.webTablesPage.firstNameField.typeText(
          faker.person.firstName()
        );
        await demoQA.webTablesPage.lastNameField.typeText(
          faker.person.lastName()
        );
        await demoQA.webTablesPage.emailField.typeText(email);
        await demoQA.webTablesPage.ageField.typeText('30');
        await demoQA.webTablesPage.salaryField.typeText('not-a-number');
        await demoQA.webTablesPage.departmentField.typeText('QA');
        await demoQA.webTablesPage.submitForm();
      });
      // #endregion

      // #region Assert
      await test.step('3. Verify the form stays open, Salary is marked invalid, and no record is added', async () => {
        await demoQA.webTablesPage.verify.formIsVisible();
        await demoQA.webTablesPage.verify.fieldIsInvalid('salary');
        await demoQA.webTablesPage.closeForm();
        await demoQA.webTablesPage.verify.rowIsVisible(email, false);
      });
      // #endregion
    }
  );

  test(
    '[TEST-28] Verify the Age field truncates input beyond its 2-character limit',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'TEST-28' },
        { type: 'priority', description: Priorities.Low },
      ],
    },
    async ({ demoQA, page }) => {
      // #region Arrange
      await test.step('1. Navigate to the Web Tables page and open the Add form', async () => {
        await page.goto(getUrl(testConfig.pages.webTables), {
          waitUntil: 'domcontentloaded',
        });
        await demoQA.webTablesPage.openAddNewRecordForm();
      });
      // #endregion

      // #region Act
      await test.step('2. Type a 3-digit value into the Age field', async () => {
        await demoQA.webTablesPage.ageField.typeText('123');
      });
      // #endregion

      // #region Assert
      await test.step('3. Verify only the first 2 digits are kept', async () => {
        await demoQA.webTablesPage.ageField.verify.hasValue('12');
      });
      // #endregion
    }
  );

  test(
    '[TEST-29] Verify closing the form discards entered data without adding a record',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'TEST-29' },
        { type: 'priority', description: Priorities.Medium },
      ],
    },
    async ({ demoQA, page }) => {
      // #region Arrange
      const email = faker.internet.email();

      await test.step('1. Navigate to the Web Tables page and open the Add form', async () => {
        await page.goto(getUrl(testConfig.pages.webTables), {
          waitUntil: 'domcontentloaded',
        });
        await demoQA.webTablesPage.openAddNewRecordForm();
      });
      // #endregion

      // #region Act
      await test.step('2. Fill the form and close it without submitting', async () => {
        await demoQA.webTablesPage.fillForm({
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email,
        });
        await demoQA.webTablesPage.closeForm();
      });
      // #endregion

      // #region Assert
      await test.step('3. Verify the form is closed and no record was added', async () => {
        await demoQA.webTablesPage.verify.formIsVisible(false);
        await demoQA.webTablesPage.verify.rowIsVisible(email, false);
      });
      // #endregion
    }
  );
});

