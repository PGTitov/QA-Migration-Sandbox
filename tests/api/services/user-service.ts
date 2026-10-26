import { APIResponse } from '@playwright/test';
import { ApiClient } from '../client';

export class UserService {
  constructor(private readonly client: ApiClient) {}

  get(userId: string, token?: string): Promise<APIResponse> {
    return this.client.get(`/Account/v1/User/${encodeURIComponent(userId)}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
  }

  delete(userId: string, token: string): Promise<APIResponse> {
    return this.client.delete(
      `/Account/v1/User/${encodeURIComponent(userId)}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
  }
}
