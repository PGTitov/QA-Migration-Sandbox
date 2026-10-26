import { Locator, Page } from '@playwright/test';
import { step } from '../../utils/decorators';
import { BookStoreLoginPageVerify } from './book-store-login-page-verify';

export class BookStoreLoginPage {
  readonly verify: BookStoreLoginPageVerify;
  readonly locators: {
    userNameInput: Locator;
    passwordInput: Locator;
    loginButton: Locator;
    loggedInUser: Locator;
  };

  constructor(protected readonly page: Page) {
    this.locators = {
      userNameInput: page.locator('#userName'),
      passwordInput: page.locator('#password'),
      loginButton: page.locator('#login'),
      loggedInUser: page.locator('#userName-value'),
    };
    this.verify = new BookStoreLoginPageVerify(this);
  }

  @step('Log in as "{{args[0]}}"')
  async login(userName: string, password: string): Promise<void> {
    await this.locators.userNameInput.fill(userName);
    await this.locators.passwordInput.fill(password);
    await this.locators.loginButton.click();
  }
}