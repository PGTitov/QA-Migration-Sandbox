import { getUrl, testConfig } from '../../config';
import {
  checkboxBranchData,
  createPracticeFormData,
  createWebTableLifecycleData,
} from '../../test-data/e2e';
import { Authors, Priorities, test } from '../fixtures';

test.describe('DemoQA end-to-end journeys', () => {
  test(
    '[E2E-01] Create, search, edit, and delete a web table record',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'E2E-01' },
        { type: 'priority', description: Priorities.High },
      ],
    },
    async ({ demoQA, page }) => {
      const { originalRecord, updatedRecord } = createWebTableLifecycleData();

      await test.step('1. Open the web tables page and create a unique record', async () => {
        await page.goto(getUrl(testConfig.pages.webTables), {
          waitUntil: 'domcontentloaded',
        });
        await demoQA.webTablesPage.addRecord(originalRecord);
        await demoQA.webTablesPage.verify.rowIsVisible(originalRecord.email);
      });

      await test.step('2. Find the new record by its unique email', async () => {
        await demoQA.webTablesPage.search(originalRecord.email);
        await demoQA.webTablesPage.verify.rowIsVisible(originalRecord.email);
        await demoQA.webTablesPage.verify.rowContains(
          originalRecord.email,
          originalRecord.firstName
        );
        await demoQA.webTablesPage.search('');
      });

      await test.step('3. Edit the record and verify its new identity', async () => {
        await demoQA.webTablesPage.editRecord(
          originalRecord.email,
          updatedRecord
        );
        await demoQA.webTablesPage.search(updatedRecord.email);
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

      await test.step('4. Search for and delete the updated record', async () => {
        await demoQA.webTablesPage.verify.rowIsVisible(updatedRecord.email);
        await demoQA.webTablesPage.deleteRecord(updatedRecord.email);
        await demoQA.webTablesPage.verify.rowIsVisible(
          updatedRecord.email,
          false
        );
      });
    }
  );

  test(
    '[E2E-02] Select a checkbox branch and update one child',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'E2E-02' },
        { type: 'priority', description: Priorities.Medium },
      ],
    },
    async ({ demoQA, page }) => {
      await test.step('1. Open the checkbox tree and expand the path to Office', async () => {
        await page.goto(getUrl(testConfig.pages.checkbox), {
          waitUntil: 'domcontentloaded',
        });
        await demoQA.checkBoxPage.verify.treeViewIsVisible();
        await demoQA.checkBoxPage.expandItem('Home');
        await demoQA.checkBoxPage.expandItem('Documents');
        await demoQA.checkBoxPage.expandItem('Office');
      });

      await test.step('2. Select Office and verify its child selections', async () => {
        await demoQA.checkBoxPage.checkItem(checkboxBranchData.parent);
        for (const child of checkboxBranchData.selectedChildren) {
          await demoQA.checkBoxPage.verify.itemIsSelected(child);
        }
      });

      await test.step('3. Unselect Public and verify other branch selections remain', async () => {
        await demoQA.checkBoxPage.uncheckItem(
          checkboxBranchData.childToUncheck
        );
        await demoQA.checkBoxPage.verify.itemIsNotSelected(
          checkboxBranchData.childToUncheck.toLowerCase()
        );
        for (const child of checkboxBranchData.remainingChildren) {
          await demoQA.checkBoxPage.verify.itemIsSelected(child);
        }
      });
    }
  );
});

test.describe('DemoQA student registration form end-to-end journeys', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(getUrl(testConfig.pages.forms), {
      waitUntil: 'domcontentloaded',
    });
  });

  test(
    '[E2E-03] Submit a valid student registration form and review its result',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'E2E-03' },
        { type: 'priority', description: Priorities.High },
      ],
    },
    async ({ demoQA }) => {
      const formData = createPracticeFormData();

      await test.step('1. Enter valid student registration details', async () => {
        await demoQA.practiceFormPage.fillBasicInfo(
          formData.firstName,
          formData.lastName
        );
        await demoQA.practiceFormPage.enterEmail(formData.email);
        await demoQA.practiceFormPage.selectGender('female');
        await demoQA.practiceFormPage.enterMobileNumber(formData.mobile);
      });

      await test.step('2. Submit and verify the submitted identity', async () => {
        await demoQA.practiceFormPage.submit();
        await demoQA.practiceFormPage.verify.successMessageAppears();
        await demoQA.practiceFormPage.verify.successMessageContains(
          formData.firstName
        );
        await demoQA.practiceFormPage.verify.successMessageContains(
          formData.lastName
        );
        await demoQA.practiceFormPage.verify.successMessageContains(
          formData.email
        );
        await demoQA.practiceFormPage.verify.successMessageContains(
          formData.mobile
        );
      });
    }
  );

  test(
    '[E2E-04] Reject a student registration form with an invalid email',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'E2E-04' },
        { type: 'priority', description: Priorities.Medium },
      ],
    },
    async ({ demoQA }) => {
      const formData = createPracticeFormData({ email: 'invalid-email' });

      await test.step('1. Enter otherwise valid details with an invalid email', async () => {
        await demoQA.practiceFormPage.fillBasicInfo(
          formData.firstName,
          formData.lastName
        );
        await demoQA.practiceFormPage.enterEmail(formData.email);
        await demoQA.practiceFormPage.selectGender('male');
        await demoQA.practiceFormPage.enterMobileNumber(formData.mobile);
      });

      await test.step('2. Submit and verify browser validation blocks the result', async () => {
        await demoQA.practiceFormPage.submit();
        await demoQA.practiceFormPage.verify.emailPatternMismatchIsPresent();
        await demoQA.practiceFormPage.verify.successDialogIsHidden();
      });
    }
  );

  test(
    '[E2E-05] Reject a student registration form without a mobile number',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'E2E-05' },
        { type: 'priority', description: Priorities.Medium },
      ],
    },
    async ({ demoQA }) => {
      const formData = createPracticeFormData({ mobile: '' });

      await test.step('1. Enter registration details without a mobile number', async () => {
        await demoQA.practiceFormPage.fillBasicInfo(
          formData.firstName,
          formData.lastName
        );
        await demoQA.practiceFormPage.enterEmail(formData.email);
        await demoQA.practiceFormPage.selectGender('female');
      });

      await test.step('2. Submit and verify browser validation blocks the result', async () => {
        await demoQA.practiceFormPage.submit();
        await demoQA.practiceFormPage.verify.mobileIsRequired();
        await demoQA.practiceFormPage.verify.successDialogIsHidden();
      });
    }
  );
});