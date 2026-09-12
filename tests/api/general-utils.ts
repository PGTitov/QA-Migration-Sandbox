import { APIRequestContext, expect } from '@playwright/test';
import { getUrl } from '../../config';

const password = 'Test@12345';

export type Account = {
  userId: string;
  userName: string;
  password: string;
};

export async function registerAccount(request: APIRequestContext): Promise<Account> {
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

export async function generateToken(request: APIRequestContext, account: Account): Promise<string> {
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

export async function deleteAccount(
  request: APIRequestContext,
  account: Account,
  token: string,
) {
  const response = await request.delete(getUrl(`/Account/v1/User/${account.userId}`), {
    headers: { Authorization: `Bearer ${token}` },
  });

  expect([200, 204]).toContain(response.status());
}