import { APIRequestContext, expect, test } from '@playwright/test';
import { testBooks } from '../../test-data/books';
import {
  AccountCredentials,
  ApiErrorResponse,
  BookListResponse,
  BookSummary,
  TokenResponse,
  UserProfile,
} from './models';
import {
  isApiErrorResponse,
  isBookListResponse,
  isBookSummaryResponse,
  isTokenResponse,
  isUserProfile,
} from './schemas';
import { createAccountCredentials, createAddBooksRequest } from './test-data';
import { createApiServices } from './services';
import { Account, deleteAccount, generateToken, registerAccount } from './general-utils';

const invalidCredentials: Array<{
  name: string;
  credentials: AccountCredentials;
  expectedStatus: number;
}> = [
  {
    name: 'unknown username',
    credentials: { userName: 'unknown-api-user', password: 'Test@12345' },
    expectedStatus: 200,
  },
  {
    name: 'incorrect password',
    credentials: { userName: 'unknown-api-user', password: 'Wrong@12345' },
    expectedStatus: 200,
  },
  {
    name: 'empty username',
    credentials: { userName: '', password: 'Test@12345' },
    expectedStatus: 400,
  },
];

const invalidUserPayloads: Array<{
  name: string;
  payload: Partial<AccountCredentials>;
}> = [
  { name: 'empty body', payload: {} },
  { name: 'missing username', payload: { password: 'Test@12345' } },
  { name: 'missing password', payload: { userName: 'missing-password-user' } },
];

const invalidIsbns = [
  { name: 'unknown ISBN', isbn: '0000000000000' },
  { name: 'malformed ISBN', isbn: 'not-an-isbn' },
  { name: 'short ISBN', isbn: '123' },
  { name: 'empty ISBN', isbn: '' },
];

async function createAuthenticatedAccount(request: APIRequestContext): Promise<{
  account: Account;
  token: string;
  services: ReturnType<typeof createApiServices>;
}> {
  const services = createApiServices(request);
  const account = await registerAccount(request);
  const token = await generateToken(request, account);
  return { account, token, services };
}

test.describe('DemoQA API resource contract', () => {
  test('GET book list matches the maintained book-list schema', async ({ request }) => {
    const response = await createApiServices(request).books.list();
    expect(response.status()).toBe(200);

    const body: unknown = await response.json();
    expect(isBookListResponse(body)).toBe(true);
    if (!isBookListResponse(body)) {
      throw new Error('Book list response does not match the API schema');
    }

    const bookList: BookListResponse = body;
    expect(bookList.books.length).toBeGreaterThan(0);
    expect(bookList.books.map(({ isbn }) => isbn)).toContain(testBooks[0].isbn);
  });

  for (const book of testBooks) {
    test(`GET book by ISBN returns the expected book: ${book.isbn}`, async ({ request }) => {
      const response = await createApiServices(request).books.getByIsbn(book.isbn);
      expect(response.status()).toBe(200);

      const body: unknown = await response.json();
      expect(isBookSummaryResponse(body)).toBe(true);
      if (!isBookSummaryResponse(body)) {
        throw new Error('Book detail response does not match the API schema');
      }

      const bookResponse: BookSummary = body;
      expect(bookResponse).toEqual(
        expect.objectContaining({
          isbn: book.isbn,
          title: book.title,
          author: book.author,
          publisher: book.publisher,
          pages: book.pages,
        }),
      );
    });
  }

  for (const testCase of invalidIsbns) {
    test(`GET book rejects an ${testCase.name}`, async ({ request }) => {
      const response = await createApiServices(request).books.getByIsbn(testCase.isbn);
      expect(response.status()).toBe(400);

      const body: unknown = await response.json();
      expect(isApiErrorResponse(body)).toBe(true);
      if (!isApiErrorResponse(body)) {
        throw new Error('Book lookup error does not match the API error schema');
      }
      const error: ApiErrorResponse = body;
      expect(error.code).toBe('1205');
    });
  }

  for (const testCase of invalidCredentials) {
    test(`GenerateToken rejects ${testCase.name}`, async ({ request }) => {
      const response = await createApiServices(request).accounts.generateToken(
        testCase.credentials,
      );
      expect(response.status()).toBe(testCase.expectedStatus);

      const body: unknown = await response.json();
      if (testCase.expectedStatus === 400) {
        expect(isApiErrorResponse(body)).toBe(true);
        return;
      }
      expect(isTokenResponse(body)).toBe(true);
      if (!isTokenResponse(body)) {
        throw new Error('Token response does not match the API schema');
      }
      const tokenResponse: TokenResponse = body;
      expect(tokenResponse.status).toBe('Failed');
      expect(tokenResponse.token).toBeNull();
    });
  }

  for (const testCase of invalidUserPayloads) {
    test(`Create user rejects ${testCase.name}`, async ({ request }) => {
      const response = await createApiServices(request).accounts.create(
        testCase.payload,
      );
      expect(response.status()).toBe(400);

      const body: unknown = await response.json();
      expect(isApiErrorResponse(body)).toBe(true);
    });
  }

  for (const invalidCase of ['unknown username', 'incorrect password'] as const) {
    test(`Authorized rejects ${invalidCase}`, async ({ request }) => {
      let credentials: AccountCredentials = {
        userName: 'unknown-api-user',
        password: 'Test@12345',
      };
      let account: Account | undefined;

      if (invalidCase === 'incorrect password') {
        account = await registerAccount(request);
        credentials = {
          userName: account.userName,
          password: 'Wrong@12345',
        };
      }

      try {
        const response = await createApiServices(request).accounts.authorize(credentials);
        expect(response.status()).toBe(404);
        expect(isApiErrorResponse(await response.json())).toBe(true);
      } finally {
        if (account) {
          await deleteAccount(request, account, await generateToken(request, account));
        }
      }
    });
  }

  test('GET user returns a profile matching the maintained user schema', async ({ request }) => {
    const { account, token, services } = await createAuthenticatedAccount(request);
    try {
      const response = await services.users.get(account.userId, token);
      expect(response.status()).toBe(200);

      const body: unknown = await response.json();
      expect(isUserProfile(body)).toBe(true);
      if (!isUserProfile(body)) {
        throw new Error('User profile does not match the API schema');
      }

      const profile: UserProfile = body;
      expect(profile.userId).toBe(account.userId);
      expect(profile.username).toBe(account.userName);
      expect(profile.books).toEqual([]);
    } finally {
      await deleteAccount(request, account, token);
    }
  });

  test('GET user rejects an invalid bearer token', async ({ request }) => {
    const account = await registerAccount(request);
    try {
      const response = await createApiServices(request).users.get(
        account.userId,
        'invalid-token',
      );
      expect(response.status()).toBe(401);
    } finally {
      const token = await generateToken(request, account);
      await deleteAccount(request, account, token);
    }
  });

  test('GET user rejects an unknown user ID when authenticated', async ({ request }) => {
    const { account, token, services } = await createAuthenticatedAccount(request);
    try {
      const response = await services.users.get(
        '00000000-0000-0000-0000-000000000000',
        token,
      );
      expect(response.status()).toBe(401);
    } finally {
      await deleteAccount(request, account, token);
    }
  });

  for (const book of testBooks) {
    test(`POST books adds ${book.title} to the user's collection`, async ({ request }) => {
      const { account, token, services } = await createAuthenticatedAccount(request);
      try {
        const response = await services.books.addToCollection(
          createAddBooksRequest(account.userId, [book.isbn]),
          token,
        );
        expect(response.status()).toBe(201);

        const profileResponse = await services.users.get(account.userId, token);
        expect(profileResponse.status()).toBe(200);
        const profileBody: unknown = await profileResponse.json();
        expect(isUserProfile(profileBody)).toBe(true);
        if (!isUserProfile(profileBody)) {
          throw new Error('User profile does not match the API schema');
        }
        expect(profileBody.books).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              isbn: book.isbn,
              title: book.title,
              author: book.author,
            }),
          ]),
        );
      } finally {
        await deleteAccount(request, account, token);
      }
    });
  }

  test('POST books rejects adding the same ISBN twice', async ({ request }) => {
    const { account, token, services } = await createAuthenticatedAccount(request);
    try {
      const payload = createAddBooksRequest(account.userId, [testBooks[0].isbn]);
      expect((await services.books.addToCollection(payload, token)).status()).toBe(201);

      const duplicateResponse = await services.books.addToCollection(payload, token);
      expect(duplicateResponse.status()).toBe(400);
      expect(isApiErrorResponse(await duplicateResponse.json())).toBe(true);
    } finally {
      await deleteAccount(request, account, token);
    }
  });

  test('POST books rejects an ISBN not in the catalog', async ({ request }) => {
    const { account, token, services } = await createAuthenticatedAccount(request);
    try {
      const response = await services.books.addToCollection(
        createAddBooksRequest(account.userId, ['not-a-catalog-isbn']),
        token,
      );
      expect(response.status()).toBe(400);
    } finally {
      await deleteAccount(request, account, token);
    }
  });

  test('POST books rejects an empty ISBN collection', async ({ request }) => {
    const { account, token, services } = await createAuthenticatedAccount(request);
    try {
      const response = await services.books.addToCollection(
        createAddBooksRequest(account.userId, []),
        token,
      );
      expect(response.status()).toBe(400);
    } finally {
      await deleteAccount(request, account, token);
    }
  });

  test('POST books rejects an unknown user ID', async ({ request }) => {
    const { account, token, services } = await createAuthenticatedAccount(request);
    try {
      const response = await services.books.addToCollection({
        ...createAddBooksRequest(account.userId, [testBooks[0].isbn]),
        userId: '00000000-0000-0000-0000-000000000000',
      }, token);
      expect(response.status()).toBe(401);
    } finally {
      await deleteAccount(request, account, token);
    }
  });

  test('DELETE book removes a book from the authenticated user collection', async ({ request }) => {
    const { account, token, services } = await createAuthenticatedAccount(request);
    try {
      const isbn = testBooks[1].isbn;
      const addResponse = await services.books.addToCollection(
        createAddBooksRequest(account.userId, [isbn]),
        token,
      );
      expect(addResponse.status()).toBe(201);

      const removeResponse = await services.books.removeFromCollection(
        { userId: account.userId, isbn },
        token,
      );
      expect(removeResponse.status()).toBe(204);

      const profileResponse = await services.users.get(account.userId, token);
      const profileBody: unknown = await profileResponse.json();
      expect(isUserProfile(profileBody)).toBe(true);
      if (!isUserProfile(profileBody)) {
        throw new Error('User profile does not match the API schema');
      }
      expect(profileBody.books).toEqual([]);
    } finally {
      await deleteAccount(request, account, token);
    }
  });

  test('PUT books replaces a book in the authenticated user collection', async ({ request }) => {
    const { account, token, services } = await createAuthenticatedAccount(request);
    const originalIsbn = testBooks[0].isbn;
    const replacementIsbn = testBooks[1].isbn;
    try {
      const addResponse = await services.books.addToCollection(
        createAddBooksRequest(account.userId, [originalIsbn]),
        token,
      );
      expect(addResponse.status()).toBe(201);

      const replaceResponse = await services.books.replaceInCollection(
        originalIsbn,
        { userId: account.userId, isbn: replacementIsbn },
        token,
      );
      expect(replaceResponse.status()).toBe(200);

      const profileResponse = await services.users.get(account.userId, token);
      const profileBody: unknown = await profileResponse.json();
      expect(isUserProfile(profileBody)).toBe(true);
      if (!isUserProfile(profileBody)) {
        throw new Error('User profile does not match the API schema');
      }
      expect(profileBody.books.map(({ isbn }) => isbn)).toEqual([replacementIsbn]);
    } finally {
      await deleteAccount(request, account, token);
    }
  });

  test('DELETE books clears the complete user collection', async ({ request }) => {
    const { account, token, services } = await createAuthenticatedAccount(request);
    try {
      const addResponse = await services.books.addToCollection(
        createAddBooksRequest(account.userId, testBooks.map(({ isbn }) => isbn)),
        token,
      );
      expect(addResponse.status()).toBe(201);

      const clearResponse = await services.books.clearCollection(
        { userId: account.userId },
        token,
      );
      expect(clearResponse.status()).toBe(204);

      const profileResponse = await services.users.get(account.userId, token);
      const profileBody: unknown = await profileResponse.json();
      expect(isUserProfile(profileBody)).toBe(true);
      if (!isUserProfile(profileBody)) {
        throw new Error('User profile does not match the API schema');
      }
      expect(profileBody.books).toEqual([]);
    } finally {
      await deleteAccount(request, account, token);
    }
  });

  test('DELETE books rejects a request without authorization', async ({ request }) => {
    const response = await createApiServices(request).books.clearCollection({
      userId: '00000000-0000-0000-0000-000000000000',
    });
    expect(response.status()).toBe(401);
  });

  test('DELETE book rejects a request without authorization', async ({ request }) => {
    const response = await createApiServices(request).books.removeFromCollection({
      isbn: testBooks[0].isbn,
      userId: '00000000-0000-0000-0000-000000000000',
    });
    expect(response.status()).toBe(401);
  });

  test('DELETE user removes a created account', async ({ request }) => {
    const { account, token, services } = await createAuthenticatedAccount(request);
    const deleteResponse = await services.users.delete(account.userId, token);
    expect([200, 204]).toContain(deleteResponse.status());

    const getResponse = await services.users.get(account.userId, token);
    expect(getResponse.status()).toBe(401);
  });
});
