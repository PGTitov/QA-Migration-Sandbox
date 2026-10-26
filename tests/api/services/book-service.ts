import { APIResponse } from '@playwright/test';
import {
  AddBooksRequest,
  DeleteBookRequest,
  DeleteBooksRequest,
  ReplaceBookRequest,
} from '../models';
import { ApiClient } from '../client';

export class BookService {
  constructor(private readonly client: ApiClient) {}

  list(): Promise<APIResponse> {
    return this.client.get('/BookStore/v1/Books');
  }

  getByIsbn(isbn: string): Promise<APIResponse> {
    return this.client.get(
      `/BookStore/v1/Book?ISBN=${encodeURIComponent(isbn)}`,
    );
  }

  addToCollection(payload: AddBooksRequest, token: string): Promise<APIResponse> {
    return this.client.post('/BookStore/v1/Books', {
      headers: { Authorization: `Bearer ${token}` },
      data: payload,
    });
  }

  removeFromCollection(
    payload: DeleteBookRequest,
    token?: string,
  ): Promise<APIResponse> {
    return this.client.delete('/BookStore/v1/Book', {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      data: payload,
    });
  }

  clearCollection(
    payload: DeleteBooksRequest,
    token?: string,
  ): Promise<APIResponse> {
    const query = new URLSearchParams({ UserId: payload.userId });
    return this.client.delete(`/BookStore/v1/Books?${query.toString()}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
  }

  replaceInCollection(
    existingIsbn: string,
    payload: ReplaceBookRequest,
    token: string,
  ): Promise<APIResponse> {
    return this.client.put(
      `/BookStore/v1/Books/${encodeURIComponent(existingIsbn)}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        data: payload,
      },
    );
  }
}
