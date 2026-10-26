import { randomUUID } from 'node:crypto';
import { AccountCredentials, AddBooksRequest } from './models';

const testPassword = 'Test@12345';

export function createAccountCredentials(): AccountCredentials {
  return {
    userName: `api-${randomUUID()}`,
    password: testPassword,
  };
}

export function createAddBooksRequest(
  userId: string,
  isbns: string[],
): AddBooksRequest {
  return {
    userId,
    collectionOfIsbns: isbns.map((isbn) => ({ isbn })),
  };
}
