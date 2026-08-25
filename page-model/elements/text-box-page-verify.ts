import { expect } from '@playwright/test';
import { step } from '../../utils/decorators';
import { TextBoxPage } from './text-box-page';

/**
 * Text Box Page verification class
 */
export class TextBoxPageVerify {
  readonly output: {
    visible(isVisible?: boolean): Promise<void>;
  };

  constructor(protected readonly page: TextBoxPage) {
    this.output = {
      visible: async (isVisible = true): Promise<void> => {
        if (isVisible) {
          await expect(this.page.locators.outputContainer).toBeVisible();
        } else {
          await expect(this.page.locators.outputContainer).not.toBeVisible();
        }
      },
    };
  }

  @step('Verify output contains Name "{{args[0]}}"')
  async outputContainsName(name: string): Promise<void> {
    await expect(this.page.locators.outputContainer).toContainText(`Name:${name}`);
  }

  @step('Verify output contains Email "{{args[0]}}"')
  async outputContainsEmail(email: string): Promise<void> {
    await expect(this.page.locators.outputContainer).toContainText(
      `Email:${email}`
    );
  }

  @step('Verify output contains "{{args[0]}}"')
  async outputContains(text: string): Promise<void> {
    await expect(this.page.locators.outputContainer).toContainText(text);
  }

  @step('Verify output is visible')
  async outputIsVisible(): Promise<void> {
    await this.output.visible();
  }

  @step('Verify Email field is invalid')
  async emailIsInvalid(): Promise<void> {
    const isValid = await this.page.locators.emailInput.evaluate(
      (field: HTMLInputElement) => field.validity.valid
    );
    expect(isValid).toBe(false);
  }

  @step('Verify Email field has an error border')
  async emailHasErrorBorder(): Promise<void> {
    await expect(this.page.locators.emailInput).toHaveClass(/field-error/);
  }

  @step('Verify Email field validation message is "{{args[0]}}"')
  async emailValidationMessageIs(expectedMessage: string): Promise<void> {
    await expect(this.page.locators.emailInput).toHaveJSProperty(
      'validationMessage',
      expectedMessage
    );
  }

  @step('Verify {{args[0]}} address field can be resized vertically')
  async addressFieldCanBeResizedVertically(
    field: 'currentAddress' | 'permanentAddress'
  ): Promise<void> {
    const addressField =
      field === 'currentAddress'
        ? this.page.locators.currentAddressInput
        : this.page.locators.permanentAddressInput;

    await expect(addressField).toHaveCSS('resize', 'vertical');
  }

  @step('Verify {{args[0]}} address field is focused')
  async addressFieldIsFocused(
    field: 'currentAddress' | 'permanentAddress'
  ): Promise<void> {
    const addressField =
      field === 'currentAddress'
        ? this.page.locators.currentAddressInput
        : this.page.locators.permanentAddressInput;

    await expect(addressField).toBeFocused();
  }

  @step('Verify {{args[0]}} address field has a blue focus border')
  async addressFieldHasBlueFocusBorder(
    field: 'currentAddress' | 'permanentAddress'
  ): Promise<void> {
    const addressField =
      field === 'currentAddress'
        ? this.page.locators.currentAddressInput
        : this.page.locators.permanentAddressInput;

    await expect(addressField).toHaveCSS('border-color', 'rgb(134, 183, 254)');
  }

  toString(): string {
    return 'Text Box Page';
  }
}
