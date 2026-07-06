import { expect } from '@playwright/test';
import { step } from '../../utils/decorators';
import { LeftSidebar } from './left-sidebar';

/**
 * Left Sidebar verification class
 */
export class LeftSidebarVerify {
  constructor(protected readonly sidebar: LeftSidebar) {}

  @step('Verify sidebar is visible')
  async isVisible(): Promise<void> {
    await expect(this.sidebar.locators.root).toBeVisible();
  }

  @step('Verify "{{args[0]}}" section is expanded')
  async sectionIsExpanded(sectionName: string): Promise<void> {
    const section = this.sidebar.locators.page.locator(
      `.element-group:has(.header-text:has-text("${sectionName}"))`
    );
    const collapseBtn = section.locator('.element-list');
    await expect(collapseBtn).not.toHaveClass(/collapse/);
  }

  override toString(): string {
    return 'Left Sidebar';
  }
}
