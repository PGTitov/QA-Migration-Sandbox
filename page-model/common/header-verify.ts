import { expect } from '@playwright/test';
import { step } from '../../utils/decorators';
import { Header } from './header';

/**
 * Header verification class
 */
export class HeaderVerify {
  constructor(protected readonly header: Header) {}

  @step('Verify header logo is visible')
  async logoIsVisible(): Promise<void> {
    await expect(this.header.locators.logo).toBeVisible();
  }

  toString(): string {
    return 'Header';
  }
}
