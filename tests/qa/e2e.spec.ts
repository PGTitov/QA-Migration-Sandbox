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

      await test.step('Open the web tables page and create a unique record', async () => {
        await page.goto(getUrl(testConfig.pages.webTables), {
          waitUntil: 'domcontentloaded',
        });
        await demoQA.webTablesPage.addRecord(originalRecord);
        await demoQA.webTablesPage.verify.rowIsVisible(originalRecord.email);
      });

      await test.step('Find the new record by its unique email', async () => {
        await demoQA.webTablesPage.search(originalRecord.email);
        await demoQA.webTablesPage.verify.rowIsVisible(originalRecord.email);
        await demoQA.webTablesPage.verify.rowContains(
          originalRecord.email,
          originalRecord.firstName
        );
        await demoQA.webTablesPage.search('');
      });

      await test.step('Edit the record and verify its new identity', async () => {
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

      await test.step('Search for and delete the updated record', async () => {
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
      await test.step('Open the checkbox tree and expand the path to Office', async () => {
        await page.goto(getUrl(testConfig.pages.checkbox), {
          waitUntil: 'domcontentloaded',
        });
        await demoQA.checkBoxPage.verify.treeViewIsVisible();
        await demoQA.checkBoxPage.expandItem('Home');
        await demoQA.checkBoxPage.expandItem('Documents');
        await demoQA.checkBoxPage.expandItem('Office');
      });

      await test.step('Select Office and verify its child selections', async () => {
        await demoQA.checkBoxPage.checkItem(checkboxBranchData.parent);
        for (const child of checkboxBranchData.selectedChildren) {
          await demoQA.checkBoxPage.verify.itemIsSelected(child);
        }
      });

      await test.step('Unselect Public and verify other branch selections remain', async () => {
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

  test(
    '[E2E-03] Submit a valid student registration form and review its result',
    {
      annotation: [
        { type: 'author', description: Authors.Pavlo },
        { type: 'id', description: 'E2E-03' },
        { type: 'priority', description: Priorities.High },
      ],
    },
    async ({ demoQA, page }) => {
      const formData = createPracticeFormData();

      await test.step('Open the student registration form and enter valid details', async () => {
        await page.goto(getUrl(testConfig.pages.forms), {
          waitUntil: 'domcontentloaded',
        });
        await demoQA.practiceFormPage.fillBasicInfo(
          formData.firstName,
          formData.lastName
        );
        await demoQA.practiceFormPage.enterEmail(formData.email);
        await demoQA.practiceFormPage.selectGender('female');
        await demoQA.practiceFormPage.enterMobileNumber(formData.mobile);
      });

      await test.step('Submit and verify the submitted identity', async () => {
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
    async ({ demoQA, page }) => {
      const formData = createPracticeFormData({ email: 'invalid-email' });

      await test.step('Open the student registration form and enter otherwise valid details', async () => {
        await page.goto(getUrl(testConfig.pages.forms), {
          waitUntil: 'domcontentloaded',
        });
        await demoQA.practiceFormPage.fillBasicInfo(
          formData.firstName,
          formData.lastName
        );
        await demoQA.practiceFormPage.enterEmail(formData.email);
        await demoQA.practiceFormPage.selectGender('male');
        await demoQA.practiceFormPage.enterMobileNumber(formData.mobile);
      });

      await test.step('Submit and verify browser validation blocks the result', async () => {
        await demoQA.practiceFormPage.submit();
        await demoQA.practiceFormPage.verify.emailPatternMismatchIsPresent();
        await demoQA.practiceFormPage.verify.successDialogIsHidden();
      });
    }
  );
});