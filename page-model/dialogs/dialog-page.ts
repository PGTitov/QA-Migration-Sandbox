import { expect, Page } from '@playwright/test';
import { step } from '../../utils/decorators';

type DialogType = 'alert' | 'beforeunload' | 'confirm' | 'prompt';

type DialogExpectation = {
  type?: DialogType;
  message?: string;
};

export class DialogPage {
  constructor(protected readonly page: Page) {}

  @step('Accept the next browser dialog')
  async acceptNext(expected: DialogExpectation = {}): Promise<void> {
    const dialog = await this.page.waitForEvent('dialog');

    try {
      if (expected.type) {
        expect(dialog.type()).toBe(expected.type);
      }
      if (expected.message) {
        expect(dialog.message()).toBe(expected.message);
      }
    } catch (error) {
      await dialog.dismiss();
      throw error;
    }

    await dialog.accept();
  }
}
