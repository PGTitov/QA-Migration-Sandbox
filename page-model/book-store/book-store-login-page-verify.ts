import { expect } from '@playwright/test';
import { step } from '../../utils/decorators';
import { BookStoreLoginPage } from './book-store-login-page';

export class BookStoreLoginPageVerify {
  constructor(protected readonly page: BookStoreLoginPage) {}

  @step('Verify logged-in user is "{{args[0]}}"')
  async loggedInUserIs(userName: string): Promise<void> {
    await expect(this.page.locators.loggedInUser).toHaveText(userName);
  }
}