import { expect } from '@playwright/test';
import { step } from '../../utils/decorators';
import { AutoCompletePage } from './auto-complete-page';

export class AutoCompletePageVerify {
  constructor(protected readonly page: AutoCompletePage) {}

  @step('Verify autocomplete selection is "{{args[0]}}"')
  async singleValueIs(value: string): Promise<void> {
    await expect(this.page.locators.singleValue).toHaveText(value);
  }
}