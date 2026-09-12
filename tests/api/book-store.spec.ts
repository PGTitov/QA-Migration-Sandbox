import { expect, test } from '@playwright/test';
import { getUrl } from '../../config';
import {
  deleteAccount,
  generateToken,
  registerAccount,
} from './general-utils';

const isbn = '9781449325862';

test.describe('DemoQA Book Store API', () => {
  test('returns the available books with the documented fields', async ({ request }) => {
    const response = await request.get(getUrl('/BookStore/v1/Books'));

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const body = await response.json();
    expect(body.books).toBeInstanceOf(Array);
    expect(body.books.length).toBeGreaterThan(0);
    expect(body.books[0]).toEqual(
      expect.objectContaining({
        isbn: expect.any(String),
        title: expect.any(String),
        author: expect.any(String),
        pages: expect.any(Number),
      }),
    );
  });

  test('returns a book by ISBN', async ({ request }) => {
    const bookResponse = await request.get(
      getUrl(`/BookStore/v1/Book?ISBN=${isbn}`),
    );

    expect(bookResponse.status()).toBe(200);
    expect((await bookResponse.json()).isbn).toBe(isbn);
  });

  test('rejects an unknown ISBN', async ({ request }) => {
    const invalidResponse = await request.get(
      getUrl('/BookStore/v1/Book?ISBN=invalid-isbn'),
    );
    expect(invalidResponse.status()).toBe(400);
  });

  test('creates an account and validates its credentials', async ({ request }) => {
    const account = await registerAccount(request);
    const token = await generateToken(request, account);

    try {
      const authorizedResponse = await request.post(getUrl('/Account/v1/Authorized'), {
        data: {
          userName: account.userName,
          password: account.password,
        },
      });

      expect(authorizedResponse.status()).toBe(200);
      expect(await authorizedResponse.json()).toBe(true);
    } finally {
      await deleteAccount(request, account, token);
    }
  });

  test('manages a user book collection with an authorized token', async ({ request }) => {
    const account = await registerAccount(request);
    const token = await generateToken(request, account);
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const userResponse = await request.get(
        getUrl(`/Account/v1/User/${account.userId}`),
        { headers },
      );
      expect(userResponse.status()).toBe(200);
      expect((await userResponse.json()).userId).toBe(account.userId);

      const addBookResponse = await request.post(getUrl('/BookStore/v1/Books'), {
        headers,
        data: {
          userId: account.userId,
          collectionOfIsbns: [{ isbn }],
        },
      });
      expect(addBookResponse.status()).toBe(201);

      const updatedUserResponse = await request.get(
        getUrl(`/Account/v1/User/${account.userId}`),
        { headers },
      );
      expect((await updatedUserResponse.json()).books).toEqual(
        expect.arrayContaining([expect.objectContaining({ isbn })]),
      );

      const removeBookResponse = await request.delete(getUrl('/BookStore/v1/Book'), {
        headers,
        data: { isbn, userId: account.userId },
      });
      expect(removeBookResponse.status()).toBe(204);
    } finally {
      await deleteAccount(request, account, token);
    }
  });

  test('rejects access to a user without a valid token', async ({ request }) => {
    const response = await request.get(
      getUrl('/Account/v1/User/00000000-0000-0000-0000-000000000000'),
    );

    expect(response.status()).toBe(401);
  });
});