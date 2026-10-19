import { expect, Locator, Page } from '@playwright/test';
import { step } from '../../utils/decorators';
import { DroppablePageVerify } from './droppable-page-verify';

export class DroppablePage {
  readonly verify: DroppablePageVerify;
  readonly locators: {
    root: Locator;
    draggable: Locator;
    dropTarget: Locator;
  };

  constructor(protected readonly page: Page) {
    this.locators = {
      root: page.locator('app-droppable'),
      draggable: page.locator('#draggable'),
      dropTarget: page
        .getByRole('tabpanel', { name: 'Simple' })
        .locator('#droppable'),
    };
    this.verify = new DroppablePageVerify(this);
  }

  @step('Drag the item into the drop target')
  async dropItem(): Promise<void> {
    await expect(this.locators.draggable).toHaveClass(/ui-draggable/);
    await expect(this.locators.dropTarget).toHaveClass(/ui-droppable/);
    await this.locators.draggable.scrollIntoViewIfNeeded();
    await this.locators.dropTarget.scrollIntoViewIfNeeded();
    await this.locators.draggable.dragTo(this.locators.dropTarget, {
      targetPosition: { x: 75, y: 75 },
    });
  }
}