import { expect, test } from '@playwright/test';
import { getUrl, testConfig } from '../../config';

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
  test('returns the available books', async ({ request }) => {
    const response = await request.get(getUrl('/BookStore/v1/Books'));

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const body = await response.json();
    expect(body.books).toBeInstanceOf(Array);
    expect(body.books.length).toBeGreaterThan(0);
  });

  test('returns a book by ISBN', async ({ request }) => {
    const response = await request.get(
      getUrl('/BookStore/v1/Book?ISBN=9781449325862'),
    );

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.isbn).toBe('9781449325862');
  });

  test('returns bad request for an invalid ISBN', async ({ request }) => {
    const response = await request.get(
      getUrl('/BookStore/v1/Book?ISBN=invalid-isbn'),
    );

    expect(response.status()).toBe(400);
  });
});