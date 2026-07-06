import { Page, Locator } from '@playwright/test';
import { TextBox } from '../controls/text-box';
import { RadioButton } from '../controls/radio-button';
import { CheckBox } from '../controls/check-box';
import { PracticeFormPageVerify } from './practice-form-page-verify';
import { step } from '../../utils/decorators';

/**
 * Practice Form Page Model
 */
export class PracticeFormPage {
  readonly verify: PracticeFormPageVerify;
  readonly locators: {
    root: Locator;
    firstNameInput: Locator;
    lastNameInput: Locator;
    emailInput: Locator;
    maleRadio: Locator;
    femaleRadio: Locator;
    otherRadio: Locator;
    mobileInput: Locator;
    dateOfBirthInput: Locator;
    subjectsInput: Locator;
    sportCheckbox: Locator;
    readingCheckbox: Locator;
    musicCheckbox: Locator;
    uploadPictureInput: Locator;
    currentAddressInput: Locator;
    stateInput: Locator;
    cityInput: Locator;
    submitButton: Locator;
    successMessage: Locator;
  };

  private firstName?: TextBox;
  private lastName?: TextBox;
  private maleBtn?: RadioButton;
  private femaleBtn?: RadioButton;

  constructor(protected readonly page: Page) {
    this.locators = {
      root: this.page.locator('app-automation-practice-form'),
      firstNameInput: this.page.locator('#firstName'),
      lastNameInput: this.page.locator('#lastName'),
      emailInput: this.page.locator('#userEmail'),
      maleRadio: this.page.locator('#male'),
      femaleRadio: this.page.locator('#female'),
      otherRadio: this.page.locator('#other'),
      mobileInput: this.page.locator('#userNumber'),
      dateOfBirthInput: this.page.locator('#dateOfBirthInput'),
      subjectsInput: this.page.locator('#subjectsInput'),
      sportCheckbox: this.page.locator('#hobbies-checkbox-1'),
      readingCheckbox: this.page.locator('#hobbies-checkbox-2'),
      musicCheckbox: this.page.locator('#hobbies-checkbox-3'),
      uploadPictureInput: this.page.locator('#uploadPicture'),
      currentAddressInput: this.page.locator('#currentAddress'),
      stateInput: this.page.locator('#react-select-3-input'),
      cityInput: this.page.locator('#react-select-4-input'),
      submitButton: this.page.locator('button:text("Submit")'),
      successMessage: this.page.locator('.modal-body'),
    };
    this.verify = new PracticeFormPageVerify(this);
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

  get maleButton(): RadioButton {
    return (this.maleBtn ??= new RadioButton(this.locators.maleRadio, 'Male'));
  }

  get femaleButton(): RadioButton {
    return (this.femaleBtn ??= new RadioButton(
      this.locators.femaleRadio,
      'Female'
    ));
  }

  @step('Fill practice form with First Name "{{args[0]}}", Last Name "{{args[1]}}"')
  async fillBasicInfo(firstName: string, lastName: string): Promise<void> {
    await this.firstNameField.typeText(firstName);
    await this.lastNameField.typeText(lastName);
  }

  @step('Select gender "{{args[0]}}"')
  async selectGender(gender: string): Promise<void> {
    if (gender.toLowerCase() === 'male') {
      await this.maleButton.select();
    } else if (gender.toLowerCase() === 'female') {
      await this.femaleButton.select();
    } else {
      const otherBtn = new RadioButton(this.locators.otherRadio, 'Other');
      await otherBtn.select();
    }
  }

  @step('Enter mobile number "{{args[0]}}"')
  async enterMobileNumber(mobile: string): Promise<void> {
    await this.locators.mobileInput.fill(mobile);
  }

  @step('Submit form')
  async submit(): Promise<void> {
    await this.locators.submitButton.click();
  }

  toString(): string {
    return 'Practice Form Page';
  }
}
