import { Locator, expect } from '@playwright/test';
import { step } from '../../utils/decorators';

export interface CommonControlOptions {
  name?: string | (() => string);
}

/**
 * Base class for all control verifications
 */
export abstract class CommonControlVerify {
  protected readonly control: Promise<Locator>;

  constructor(
    control: Locator | Promise<Locator>,
    protected readonly options: CommonControlOptions = {}
  ) {
    this.control = Promise.resolve(control);
  }

  @step('Verify {{this}} is disabled')
  async disabled(isDisabled: boolean = true): Promise<void> {
    const control = await this.control;
    await expect(control).toHaveAttribute('disabled', isDisabled ? '' : null);
  }

  @step('Verify {{this}} is visible')
  async visible(isVisible: boolean = true): Promise<void> {
    const control = await this.control;
    if (isVisible) {
      await expect(control).toBeVisible();
    } else {
      await expect(control).not.toBeVisible();
    }
  }

  @step('Verify {{this}} exists')
  async exists(expected: boolean = true): Promise<void> {
    const control = await this.control;
    if (expected) {
      await expect(control).toBeTruthy();
    } else {
      await expect(control).toBeFalsy();
    }
  }

  @step('Verify {{this}} is focused')
  async focused(isFocused: boolean = true): Promise<void> {
    const control = await this.control;
    if (isFocused) {
      await expect(control).toBeFocused();
    } else {
      // Verify it's not focused
      await control.evaluate((el) => {
        expect(document.activeElement).not.toBe(el);
      });
    }
  }

  protected getName(): string {
    if (typeof this.options.name === 'function') {
      return this.options.name();
    }
    return this.options.name || 'Control';
  }

  abstract toString(): string;
}
