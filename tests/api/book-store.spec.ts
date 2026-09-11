import { APIRequestContext, expect, test } from '@playwright/test';
import { getUrl } from '../../config';

const isbn = '9781449325862';
const password = 'Test@12345';

type Account = {
  userId: string;
  userName: string;
  password: string;
};

async function registerAccount(request: APIRequestContext): Promise<Account> {
  const account = {
    userName: `api-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    password,
  };
  const response = await request.post(getUrl('/Account/v1/User'), {
    data: account,
  });

  expect(response.status()).toBe(201);
  const body = await response.json();
  expect(body.username).toBe(account.userName);
  expect(body.userID).toBeTruthy();

  return { userId: body.userID, ...account };
}

async function generateToken(request: APIRequestContext, account: Account): Promise<string> {
  const response = await request.post(getUrl('/Account/v1/GenerateToken'), {
    data: {
      userName: account.userName,
      password: account.password,
    },
  });

  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.status).toBe('Success');
  expect(body.token).toBeTruthy();

  return body.token;
}

async function deleteAccount(
  request: APIRequestContext,
  account: Account,
  token: string,
) {
  const response = await request.delete(getUrl(`/Account/v1/User/${account.userId}`), {
    headers: { Authorization: `Bearer ${token}` },
  });

  expect([200, 204]).toContain(response.status());
}

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

  test('returns a book by ISBN and rejects an unknown ISBN', async ({ request }) => {
    const bookResponse = await request.get(
      getUrl(`/BookStore/v1/Book?ISBN=${isbn}`),
    );

    expect(bookResponse.status()).toBe(200);
    expect((await bookResponse.json()).isbn).toBe(isbn);

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