import { APIRequestContext } from '@playwright/test';
import { ApiClient } from '../client';
import { AccountService } from './account-service';
import { BookService } from './book-service';
import { UserService } from './user-service';

export function createApiServices(request: APIRequestContext) {
  const client = new ApiClient(request);

  return {
    accounts: new AccountService(client),
    books: new BookService(client),
    users: new UserService(client),
  };
}

export { AccountService } from './account-service';
export { BookService } from './book-service';
export { UserService } from './user-service';
