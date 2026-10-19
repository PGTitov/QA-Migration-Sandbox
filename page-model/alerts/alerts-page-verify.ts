import { expect } from '@playwright/test';
import { step } from '../../utils/decorators';
import { AlertsPage } from './alerts-page';

export class AlertsPageVerify {
  constructor(protected readonly page: AlertsPage) {}

  @step('Verify confirmation result contains "{{args[0]}}"')
  async confirmResultContains(text: string): Promise<void> {
    await expect(this.page.locators.confirmResult).toContainText(text);
  }
}