import { expect, test } from '@playwright/test';
import { getUrl, testConfig } from '../../config';
import { testBooks } from '../../test-data/books';
import {
  deleteAccount,
  generateToken,
  registerAccount,
} from './general-utils';

const testBook = testBooks[0];

const pageRoutes = [
  ['Elements', testConfig.pages.elements],
  ['Text Box', testConfig.pages.textBox],
  ['Checkbox', testConfig.pages.checkbox],
  ['Radio Button', testConfig.pages.radioButton],
  ['Web Tables', testConfig.pages.webTables],
  ['Buttons', testConfig.pages.buttons],
  ['Links', testConfig.pages.links],
  ['Broken Links and Images', testConfig.pages.brokenLinksImages],
  ['Upload and Download', testConfig.pages.uploadDownload],
  ['Dynamic Properties', testConfig.pages.dynamicProperties],
  ['Practice Form', testConfig.pages.forms],
  ['Accordion', testConfig.pages.widgets.accordian],
  ['Auto Complete', testConfig.pages.widgets.autoComplete],
  ['Date Picker', testConfig.pages.widgets.datePicker],
  ['Slider', testConfig.pages.widgets.slider],
  ['Progress Bar', testConfig.pages.widgets.progressBar],
  ['Tabs', testConfig.pages.widgets.tabs],
  ['Tool Tips', testConfig.pages.widgets.toolTips],
  ['Menu', testConfig.pages.widgets.menu],
  ['Select Menu', testConfig.pages.widgets.selectMenu],
  ['Browser Windows', testConfig.pages.alerts.browserWindows],
  ['Alerts', testConfig.pages.alerts.alerts],
  ['Frames', testConfig.pages.alerts.frames],
  ['Nested Frames', testConfig.pages.alerts.nestedFrames],
  ['Modal Dialogs', testConfig.pages.alerts.modalDialogs],
  ['Sortable', testConfig.pages.interactions.sortable],
  ['Selectable', testConfig.pages.interactions.selectable],
  ['Resizable', testConfig.pages.interactions.resizable],
  ['Droppable', testConfig.pages.interactions.droppable],
  ['Draggable', testConfig.pages.interactions.draggable],
  ['Book Store Login', testConfig.pages.bookStore.login],
  ['Book Store Books', testConfig.pages.bookStore.books],
  ['Book Store Profile', testConfig.pages.bookStore.profile],
  ['Book Store Swagger', testConfig.pages.bookStore.swagger],
] as const;

test.describe('DemoQA page API smoke tests', () => {
  for (const [pageName, pagePath] of pageRoutes) {
    test(`${pageName} responds successfully`, async ({ request }) => {
      const response = await request.get(getUrl(pagePath));

      expect(response.ok()).toBe(true);
      expect(response.headers()['content-type']).toContain('text/html');
    });
  }
});

test.describe('DemoQA Book Store API tests', () => {
  test.describe('GET /BookStore/v1/Books', () => {
    test('should return the available book list', async ({ request }) => {
      const response = await request.get(getUrl('/BookStore/v1/Books'));

      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain('application/json');

      const body = await response.json();
      expect(body.books).toBeInstanceOf(Array);
      expect(body.books.length).toBeGreaterThan(0);
      expect(body.books).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ isbn: testBook.isbn }),
        ]),
      );
      expect(body.books).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            isbn: expect.any(String),
            title: expect.any(String),
            subTitle: expect.any(String),
            author: expect.any(String),
            publish_date: expect.any(String),
            publisher: expect.any(String),
            pages: expect.any(Number),
            description: expect.any(String),
            website: expect.any(String),
          }),
        ]),
      );
    });
  });

  test.describe('GET /BookStore/v1/Book', () => {
    test('should return a book by ISBN', async ({ request }) => {
      const response = await request.get(
        getUrl(`/BookStore/v1/Book?ISBN=${testBook.isbn}`),
      );

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.isbn).toBe(testBook.isbn);
    });

    test('should reject an invalid ISBN with 400', async ({ request }) => {
      const response = await request.get(
        getUrl('/BookStore/v1/Book?ISBN=invalid-isbn'),
      );

      expect(response.status()).toBe(400);
    });
  });

  test.describe('POST /BookStore/v1/Books', () => {
    test('should add testBooks[0] and return its exact data', async ({ request }) => {
      const postedBook = testBooks[0];
      const account = await registerAccount(request);
      const token = await generateToken(request, account);
      const headers = { Authorization: `Bearer ${token}` };

      try {
        const addBookResponse = await request.post(getUrl('/BookStore/v1/Books'), {
          headers,
          data: {
            userId: account.userId,
            collectionOfIsbns: [{ isbn: postedBook.isbn }],
          },
        });

        expect(addBookResponse.status()).toBe(201);

        const userResponse = await request.get(
          getUrl(`/Account/v1/User/${account.userId}`),
          { headers },
        );
        expect(userResponse.status()).toBe(200);
        expect((await userResponse.json()).books).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              isbn: postedBook.isbn,
              title: postedBook.title,
              subTitle: postedBook.subTitle,
              author: postedBook.author,
              publisher: postedBook.publisher,
              pages: postedBook.pages,
            }),
          ]),
        );

        const removeBookResponse = await request.delete(getUrl('/BookStore/v1/Book'), {
          headers,
          data: { isbn: postedBook.isbn, userId: account.userId },
        });
        expect(removeBookResponse.status()).toBe(204);
      } finally {
        await deleteAccount(request, account, token);
      }
    });
  });

});