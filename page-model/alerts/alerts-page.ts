import { Locator, Page } from '@playwright/test';
import { step } from '../../utils/decorators';
import { AlertsPageVerify } from './alerts-page-verify';

export class AlertsPage {
  readonly verify: AlertsPageVerify;
  readonly locators: {
    root: Locator;
    confirmButton: Locator;
    confirmResult: Locator;
  };

  constructor(protected readonly page: Page) {
    this.locators = {
      root: page.locator('app-alerts'),
      confirmButton: page.locator('#confirmButton'),
      confirmResult: page.locator('#confirmResult'),
    };
    this.verify = new AlertsPageVerify(this);
  }

  @step('Trigger the confirmation dialog')
  async triggerConfirm(): Promise<void> {
    await this.locators.confirmButton.click();
  }
}