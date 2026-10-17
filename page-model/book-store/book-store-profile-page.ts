import { Locator, Page } from '@playwright/test';
import { step } from '../../utils/decorators';
import { BookStoreProfilePageVerify } from './book-store-profile-page-verify';

export class BookStoreProfilePage {
  readonly verify: BookStoreProfilePageVerify;
  readonly locators: {
    loggedInUser: Locator;
    bookRows: Locator;
  };

  constructor(protected readonly page: Page) {
    this.locators = {
      loggedInUser: page.locator('#userName-value'),
      bookRows: page.getByRole('row'),
    };
    this.verify = new BookStoreProfilePageVerify(this);
  }

  toString(): string {
    return 'Book Store Profile Page';
  }
}