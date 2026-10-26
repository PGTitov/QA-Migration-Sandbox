import { expect, test } from '@playwright/test';
import {
  deleteAccount,
  generateToken,
  registerAccount,
} from './general-utils';
import { testBooks } from '../../test-data/books';
import { createApiServices } from './services';

const testBook = testBooks[0];

test.describe('DemoQA Book Store API', () => {
  test.describe('GET /BookStore/v1/Books', () => {
    test('should return books with the documented fields', async ({ request }) => {
      const response = await createApiServices(request).books.list();

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
  });

  test.describe('GET /BookStore/v1/Book', () => {
    test('should return a book by ISBN', async ({ request }) => {
      const bookResponse = await createApiServices(request).books.getByIsbn(testBook.isbn);

      expect(bookResponse.status()).toBe(200);
      expect(await bookResponse.json()).toEqual(
        expect.objectContaining({
          isbn: testBook.isbn,
          title: expect.any(String),
          subTitle: expect.any(String),
          author: expect.any(String),
          publish_date: expect.any(String),
          publisher: expect.any(String),
          pages: expect.any(Number),
          description: expect.any(String),
          website: expect.any(String),
        }),
      );
    });

    test('should reject an unknown ISBN with 400', async ({ request }) => {
      const invalidResponse = await createApiServices(request).books.getByIsbn('invalid-isbn');
      expect(invalidResponse.status()).toBe(400);
      expect(await invalidResponse.json()).toEqual({
        code: '1205',
        message: 'ISBN supplied is not available in Books Collection!',
      });
    });

    test('should fail token generation for invalid credentials', async ({ request }) => {
      const response = await createApiServices(request).accounts.generateToken({
          userName: 'non-existent-user',
          password: 'Wrong@12345',
      });

      expect(response.status()).toBe(200);
      expect(await response.json()).toEqual({
        token: null,
        expires: null,
        status: 'Failed',
        result: 'User authorization failed.',
      });
    });
  });

  test('POST /Account/v1/User and /Account/v1/GenerateToken should create and authorize an account', async ({ request }) => {
    const services = createApiServices(request);
    const account = await registerAccount(request);
    const token = await generateToken(request, account);

    try {
      const authorizedResponse = await services.accounts.authorize(account);

      expect(authorizedResponse.status()).toBe(200);
      expect(await authorizedResponse.json()).toBe(true);
    } finally {
      await deleteAccount(request, account, token);
    }
  });

  test('POST /BookStore/v1/Books should add a book and return its data in the user collection', async ({ request }) => {
    const services = createApiServices(request);
    const postedBook = testBooks[1];
    const account = await registerAccount(request);
    const token = await generateToken(request, account);

    try {
      const userResponse = await services.users.get(account.userId, token);
      expect(userResponse.status()).toBe(200);
      expect((await userResponse.json()).userId).toBe(account.userId);

      const addBookResponse = await services.books.addToCollection({
          userId: account.userId,
          collectionOfIsbns: [{ isbn: postedBook.isbn }],
      }, token);
      expect(addBookResponse.status()).toBe(201);

      const updatedUserResponse = await services.users.get(account.userId, token);
      expect((await updatedUserResponse.json()).books).toEqual(
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

      const removeBookResponse = await services.books.removeFromCollection(
        { isbn: postedBook.isbn, userId: account.userId },
        token,
      );
      expect(removeBookResponse.status()).toBe(204);
    } finally {
      await deleteAccount(request, account, token);
    }
  });

  test('GET /Account/v1/User/{userId} should reject access without a valid token', async ({ request }) => {
    const response = await createApiServices(request).users.get(
      '00000000-0000-0000-0000-000000000000',
    );

    expect(response.status()).toBe(401);
  });

  test('GET /Account/v1/User/{userId} should reject a non-existent user ID even with a valid token', async ({ request }) => {
    const services = createApiServices(request);
    const account = await registerAccount(request);
    const token = await generateToken(request, account);

    try {
      const response = await services.users.get(
        '00000000-0000-0000-0000-000000000000',
        token,
      );

      expect(response.status()).toBe(401);
      expect(await response.json()).toEqual({
        code: '1207',
        message: 'User not found!',
      });
    } finally {
      await deleteAccount(request, account, token);
    }
  });
});