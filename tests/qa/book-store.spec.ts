import { expect, test } from '../fixtures';
import { getUrl, testConfig } from '../../config';
import { testBooks } from '../../test-data/books';
import type { Account } from '../api/general-utils';
import {
  deleteAccount,
  generateToken,
  registerAccount,
} from '../api/general-utils';

test.describe('DemoQA Book Store UI', () => {
  const book = testBooks[0];
  let accountForCleanup: Account | undefined;
  let bookWasAdded = false;

  test.afterEach(async ({ request }) => {
    if (!accountForCleanup) {
      return;
    }

    const account = accountForCleanup;
    const shouldRemoveBook = bookWasAdded;
    accountForCleanup = undefined;
    bookWasAdded = false;

    const cleanupToken = await generateToken(request, account);
    try {
      if (shouldRemoveBook) {
        const removeBookResponse = await request.delete(
          getUrl('/BookStore/v1/Book'),
          {
            headers: { Authorization: `Bearer ${cleanupToken}` },
            data: { isbn: book.isbn, userId: account.userId },
          }
        );
        expect(removeBookResponse.status()).toBe(204);
      }
    } finally {
      await deleteAccount(request, account, cleanupToken);
    }
  });

  test('an API-provisioned user can add a book through the UI', async ({ demoQA, page, request }) => {
    const account = await registerAccount(request);
    accountForCleanup = account;

    await test.step('1. Open the login page and sign in as the provisioned user', async () => {
      await page.goto(getUrl(testConfig.pages.bookStore.login), {
        waitUntil: 'domcontentloaded',
      });
      await demoQA.bookStoreLoginPage.login(account.userName, account.password);
      await demoQA.bookStoreLoginPage.verify.loggedInUserIs(account.userName);
    });

    await test.step('2. Open the Books page, search for the book, and add it to the collection', async () => {
      await page.goto(getUrl(testConfig.pages.bookStore.books), {
        waitUntil: 'domcontentloaded',
      });
      await demoQA.bookStoreBooksPage.search(book.title);
      await demoQA.bookStoreBooksPage.openBook(book.title);

      const dialogHandled = demoQA.dialog.acceptNext({ type: 'alert' });
      await demoQA.bookStoreBooksPage.addToCollection();
      await dialogHandled;
      bookWasAdded = true;
    });

    await test.step('3. Verify the book is present in the user profile', async () => {
      await page.goto(getUrl(testConfig.pages.bookStore.profile), {
        waitUntil: 'domcontentloaded',
      });
      await demoQA.bookStoreProfilePage.verify.loggedInUserIs(account.userName);
      await demoQA.bookStoreProfilePage.verify.bookIsInCollection(book.title);
    });
  });
});