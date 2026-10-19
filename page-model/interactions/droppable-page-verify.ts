import { expect } from '@playwright/test';
import { step } from '../../utils/decorators';
import { DroppablePage } from './droppable-page';

export class DroppablePageVerify {
  constructor(protected readonly page: DroppablePage) {}

  @step('Verify the drop target contains "{{args[0]}}"')
  async targetContains(text: string): Promise<void> {
    await expect(this.page.locators.dropTarget).toContainText(text);
  }
}