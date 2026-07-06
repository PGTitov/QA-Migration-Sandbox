import { Page, Locator } from '@playwright/test';
import { TextBox } from '../controls/text-box';
import { TextBoxPageVerify } from './text-box-page-verify';
import { step } from '../../utils/decorators';

/**
 * Text Box Page Model
 */
export class TextBoxPage {
  readonly verify: TextBoxPageVerify;
  readonly locators: {
    root: Locator;
    fullNameInput: Locator;
    emailInput: Locator;
    currentAddressInput: Locator;
    permanentAddressInput: Locator;
    submitButton: Locator;
    outputContainer: Locator;
  };

  private fullName?: TextBox;
  private email?: TextBox;
  private currentAddress?: TextBox;
  private permanentAddress?: TextBox;

  constructor(protected readonly page: Page) {
    this.locators = {
      root: this.page.locator('form#userForm'),
      fullNameInput: this.page.locator('#userName'),
      emailInput: this.page.locator('#userEmail'),
      currentAddressInput: this.page.locator('#currentAddress'),
      permanentAddressInput: this.page.locator('#permanentAddress'),
      submitButton: this.page.locator('#submit'),
      outputContainer: this.page.locator('#output'),
    };
    this.verify = new TextBoxPageVerify(this);
  }

  get fullNameField(): TextBox {
    return (this.fullName ??= new TextBox(
      this.locators.fullNameInput,
      'Full Name'
    ));
  }

  get emailField(): TextBox {
    return (this.email ??= new TextBox(this.locators.emailInput, 'Email'));
  }

  get currentAddressField(): TextBox {
    return (this.currentAddress ??= new TextBox(
      this.locators.currentAddressInput,
      'Current Address'
    ));
  }

  get permanentAddressField(): TextBox {
    return (this.permanentAddress ??= new TextBox(
      this.locators.permanentAddressInput,
      'Permanent Address'
    ));
  }

  @step('Fill text box form with Full Name "{{args[0]}}", Email "{{args[1]}}"')
  async fillForm(
    fullName: string,
    email: string,
    currentAddress: string = '',
    permanentAddress: string = ''
  ): Promise<void> {
    await this.fullNameField.typeText(fullName);
    await this.emailField.typeText(email);
    if (currentAddress) {
      await this.currentAddressField.typeText(currentAddress);
    }
    if (permanentAddress) {
      await this.permanentAddressField.typeText(permanentAddress);
    }
  }

  @step('Submit text box form')
  async submit(): Promise<void> {
    await this.locators.submitButton.click();
  }

  toString(): string {
    return 'Text Box Page';
  }
}
