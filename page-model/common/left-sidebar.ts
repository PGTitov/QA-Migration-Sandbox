import { Page, Locator } from '@playwright/test';
import { Button } from '../controls/button';
import { LeftSidebarVerify } from './left-sidebar-verify';
import { step } from '../../utils/decorators';

/**
 * Navigation menu item
 */
export interface MenuItemConfig {
  text: string;
  path: string;
  selector: string;
}

/**
 * Left Sidebar page model
 */
export class LeftSidebar {
  readonly verify: LeftSidebarVerify;
  readonly locators: {
    root: Locator;
    navBar: Locator;
    menuGroups: Locator;
    toggleButton: Locator;
  };

  constructor(protected readonly page: Page) {
    this.locators = {
      root: this.page.locator('.left-pannel'),
      navBar: this.page.locator('.navbar-dark'),
      menuGroups: this.page.locator('.element-group'),
      toggleButton: this.page.locator('.navbar-toggler'),
    };
    this.verify = new LeftSidebarVerify(this);
  }

  @step('Toggle sidebar menu')
  async toggleMenu(): Promise<void> {
    await this.locators.toggleButton.click();
  }

  @step('Navigate to {{args[0]}}')
  async navigateToPage(pageName: string): Promise<void> {
    const link = this.page.locator(`a[href="/${pageName}"]`);
    await link.click();
  }

  @step('Click menu item "{{args[0]}}"')
  async clickMenuItem(itemText: string): Promise<void> {
    const menuItem = this.page.locator('.menu-list li:has-text("' + itemText + '")');
    await menuItem.click();
  }

  @step('Expand "{{args[0]}}" section')
  async expandSection(sectionName: string): Promise<void> {
    const section = this.page.locator(
      `.element-group:has(.header-text:has-text("${sectionName}"))`
    );
    const collapseBtn = section.locator('.element-list');
    const isCollapsed = await collapseBtn.evaluate((el) =>
      el.classList.contains('collapse')
    );
    if (isCollapsed) {
      await section.locator('.group-header').click();
    }
  }

  toString(): string {
    return 'Left Sidebar';
  }
}
