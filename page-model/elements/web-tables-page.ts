import { Page, Locator } from '@playwright/test';
import { TextBox } from '../controls/text-box';
import { WebTablesPageVerify } from './web-tables-page-verify';
import { step } from '../../utils/decorators';

export interface WebTableRecord {
  firstName: string;
  lastName: string;
  email: string;
  age?: string;
  salary?: string;
  department?: string;
}

export type WebTableField =
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'age'
  | 'salary'
  | 'department';

/**
 * Web Tables Page Model
 */
export class WebTablesPage {
  readonly verify: WebTablesPageVerify;
  readonly locators: {
    root: Locator;
    addButton: Locator;
    searchBox: Locator;
    rows: Locator;
    modal: Locator;
    firstNameInput: Locator;
    lastNameInput: Locator;
    emailInput: Locator;
    ageInput: Locator;
    salaryInput: Locator;
    departmentInput: Locator;
    submitButton: Locator;
    closeButton: Locator;
  };

  private firstName?: TextBox;
  private lastName?: TextBox;
  private email?: TextBox;
  private age?: TextBox;
  private salary?: TextBox;
  private department?: TextBox;

  constructor(protected readonly page: Page) {
    this.locators = {
      root: this.page.locator('.web-tables-wrapper'),
      addButton: this.page.locator('#addNewRecordButton'),
      searchBox: this.page.locator('#searchBox'),
      rows: this.page.locator('table tbody tr'),
      modal: this.page.locator('.modal-content'),
      firstNameInput: this.page.locator('#firstName'),
      lastNameInput: this.page.locator('#lastName'),
      emailInput: this.page.locator('#userEmail'),
      ageInput: this.page.locator('#age'),
      salaryInput: this.page.locator('#salary'),
      departmentInput: this.page.locator('#department'),
      submitButton: this.page.locator('#submit'),
      closeButton: this.page.locator('.modal-header .btn-close'),
    };
    this.verify = new WebTablesPageVerify(this);
  }

  get firstNameField(): TextBox {
    return (this.firstName ??= new TextBox(
      this.locators.firstNameInput,
      'First Name'
    ));
  }

  get lastNameField(): TextBox {
    return (this.lastName ??= new TextBox(
      this.locators.lastNameInput,
      'Last Name'
    ));
  }

  get emailField(): TextBox {
    return (this.email ??= new TextBox(this.locators.emailInput, 'Email'));
  }

  get ageField(): TextBox {
    return (this.age ??= new TextBox(this.locators.ageInput, 'Age'));
  }

  get salaryField(): TextBox {
    return (this.salary ??= new TextBox(this.locators.salaryInput, 'Salary'));
  }

  get departmentField(): TextBox {
    return (this.department ??= new TextBox(
      this.locators.departmentInput,
      'Department'
    ));
  }

  /**
   * Locates the row containing the given email; a row is unique per email
   */
  getRowByEmail(email: string): Locator {
    return this.locators.rows.filter({ hasText: email });
  }

  getFieldLocator(field: WebTableField): Locator {
    const locatorMap: Record<WebTableField, Locator> = {
      firstName: this.locators.firstNameInput,
      lastName: this.locators.lastNameInput,
      email: this.locators.emailInput,
      age: this.locators.ageInput,
      salary: this.locators.salaryInput,
      department: this.locators.departmentInput,
    };
    return locatorMap[field];
  }

  @step('Open the Add new record form')
  async openAddNewRecordForm(): Promise<void> {
    await this.locators.addButton.click();
    await this.locators.modal.waitFor({ state: 'visible' });
  }

  @step('Open the edit form for row with email "{{args[0]}}"')
  async openEditForm(email: string): Promise<void> {
    const row = this.getRowByEmail(email);
    await row.locator('[id^="edit-record-"]').click();
    await this.locators.modal.waitFor({ state: 'visible' });
  }

  @step('Delete row with email "{{args[0]}}"')
  async deleteRecord(email: string): Promise<void> {
    const row = this.getRowByEmail(email);
    await row.locator('[id^="delete-record-"]').click();
  }

  @step('Fill registration form')
  async fillForm(record: WebTableRecord): Promise<void> {
    await this.firstNameField.typeText(record.firstName);
    await this.lastNameField.typeText(record.lastName);
    await this.emailField.typeText(record.email);
    if (record.age) {
      await this.ageField.typeText(record.age);
    }
    if (record.salary) {
      await this.salaryField.typeText(record.salary);
    }
    if (record.department) {
      await this.departmentField.typeText(record.department);
    }
  }

  @step('Submit the registration form')
  async submitForm(): Promise<void> {
    await this.locators.submitButton.click();
  }

  @step('Close the registration form')
  async closeForm(): Promise<void> {
    await this.locators.closeButton.click();
  }

  @step('Add a new record with the given details')
  async addRecord(record: WebTableRecord): Promise<void> {
    await this.openAddNewRecordForm();
    await this.fillForm(record);
    await this.submitForm();
  }

  @step('Edit the record with email "{{args[0]}}"')
  async editRecord(
    email: string,
    updatedRecord: WebTableRecord
  ): Promise<void> {
    await this.openEditForm(email);
    await this.firstNameField.clear();
    await this.lastNameField.clear();
    await this.emailField.clear();
    await this.ageField.clear();
    await this.salaryField.clear();
    await this.departmentField.clear();
    await this.fillForm(updatedRecord);
    await this.submitForm();
  }

  @step('Search the table for "{{args[0]}}"')
  async search(text: string): Promise<void> {
    await this.locators.searchBox.fill(text);
  }

  toString(): string {
    return 'Web Tables Page';
  }
}
