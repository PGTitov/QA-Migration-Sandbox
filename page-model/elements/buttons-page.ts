import { Page, Locator } from '@playwright/test';
import { Button } from '../controls/button';
import { ButtonsPageVerify } from './buttons-page-verify';
import { step } from '../../utils/decorators';

/**
 * Buttons Page Model
 */
export class ButtonsPage {
  readonly verify: ButtonsPageVerify;
  readonly locators: {
    root: Locator;
    doubleClickButton: Locator;
    rightClickButton: Locator;
    clickMeButton: Locator;
    messages: Locator;
  };

  private doubleClickBtn?: Button;
  private rightClickBtn?: Button;
  private clickMeBtn?: Button;

  constructor(protected readonly page: Page) {
    this.locators = {
      root: this.page.locator('app-buttons'),
      doubleClickButton: this.page.locator('#doubleClickBtn'),
      rightClickButton: this.page.locator('#rightClickBtn'),
      clickMeButton: this.page.locator('button:text("Click Me")').last(),
      messages: this.page.locator('.mt-3'),
    };
    this.verify = new ButtonsPageVerify(this);
  }

  get doubleClickBtn(): Button {
    return (this.doubleClickBtn ??= new Button(
      this.locators.doubleClickButton,
      'Double Click'
    ));
  }

  get rightClickBtn(): Button {
    return (this.rightClickBtn ??= new Button(
      this.locators.rightClickButton,
      'Right Click'
    ));
  }

  get clickMeBtn(): Button {
    return (this.clickMeBtn ??= new Button(
      this.locators.clickMeButton,
      'Click Me'
    ));
  }

  @step('Double click button')
  async performDoubleClick(): Promise<void> {
    await this.doubleClickBtn.doubleClick();
  }

  @step('Right click button')
  async performRightClick(): Promise<void> {
    await this.rightClickBtn.rightClick();
  }

  @step('Single click button')
  async performSingleClick(): Promise<void> {
    await this.clickMeBtn.click();
  }

  toString(): string {
    return 'Buttons Page';
  }
}
