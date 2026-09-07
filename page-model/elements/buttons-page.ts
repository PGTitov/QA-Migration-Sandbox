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

  private _doubleClickBtn?: Button;
  private _rightClickBtn?: Button;
  private _clickMeBtn?: Button;

  constructor(protected readonly page: Page) {
    this.locators = {
      root: this.page.locator('app-buttons'),
      doubleClickButton: this.page.locator('#doubleClickBtn'),
      rightClickButton: this.page.locator('#rightClickBtn'),
      clickMeButton: this.page.locator('button:text("Click Me")').last(),
      messages: this.page.locator(
        '#doubleClickMessage, #rightClickMessage, #dynamicClickMessage'
      ),
    };
    this.verify = new ButtonsPageVerify(this);
  }

  get doubleClickBtn(): Button {
    return (this._doubleClickBtn ??= new Button(
      this.locators.doubleClickButton,
      'Double Click'
    ));
  }

  get rightClickBtn(): Button {
    return (this._rightClickBtn ??= new Button(
      this.locators.rightClickButton,
      'Right Click'
    ));
  }

  get clickMeBtn(): Button {
    return (this._clickMeBtn ??= new Button(
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
