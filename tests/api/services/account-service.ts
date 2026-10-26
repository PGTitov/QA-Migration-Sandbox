import { APIResponse } from '@playwright/test';
import { AccountCredentials } from '../models';
import { ApiClient } from '../client';

export class AccountService {
  constructor(private readonly client: ApiClient) {}

  create(credentials: Partial<AccountCredentials>): Promise<APIResponse> {
    return this.client.post('/Account/v1/User', { data: credentials });
  }

  generateToken(credentials: AccountCredentials): Promise<APIResponse> {
    return this.client.post('/Account/v1/GenerateToken', {
      data: credentials,
    });
  }

  authorize(credentials: AccountCredentials): Promise<APIResponse> {
    return this.client.post('/Account/v1/Authorized', {
      data: credentials,
    });
  }
}
