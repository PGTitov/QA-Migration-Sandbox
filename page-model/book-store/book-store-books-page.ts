import { Locator, Page } from '@playwright/test';
import { step } from '../../utils/decorators';

export class BookStoreBooksPage {
  readonly locators: {
    searchInput: Locator;
    addToCollectionButton: Locator;
  };

  constructor(protected readonly page: Page) {
    this.locators = {
      searchInput: page.locator('#searchBox'),
      addToCollectionButton: page.getByRole('button', {
        name: 'Add To Your Collection',
        exact: true,
      }),
    };
  }

  @step('Search the catalog for "{{args[0]}}"')
  async search(title: string): Promise<void> {
    await this.locators.searchInput.fill(title);
  }

  @step('Open book "{{args[0]}}"')
  async openBook(title: string): Promise<void> {
    await this.page.getByRole('link', { name: title, exact: true }).click();
  }

  @step('Add the displayed book to the collection')
  async addToCollection(): Promise<void> {
    await this.locators.addToCollectionButton.click();
  }
}