import { expect } from '@playwright/test';
import { step } from '../../utils/decorators';
import { BookStoreProfilePage } from './book-store-profile-page';

export class BookStoreProfilePageVerify {
  constructor(protected readonly page: BookStoreProfilePage) {}

  @step('Verify the logged-in user is "{{args[0]}}"')
  async loggedInUserIs(userName: string): Promise<void> {
    await expect(this.page.locators.loggedInUser).toHaveText(userName);
  }

  @step('Verify the collection contains the book "{{args[0]}}"')
  async bookIsInCollection(title: string): Promise<void> {
    await expect(this.page.locators.bookRows.filter({ hasText: title })).toBeVisible();
  }
}