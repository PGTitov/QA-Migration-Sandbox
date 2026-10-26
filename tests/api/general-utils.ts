import { APIRequestContext, expect } from '@playwright/test';
import { AccountCredentials } from './models';
import { isCreateUserResponse, isTokenResponse } from './schemas';
import { createAccountCredentials } from './test-data';
import { createApiServices } from './services';

export interface Account extends AccountCredentials {
  userId: string;
}

export async function registerAccount(request: APIRequestContext): Promise<Account> {
  const services = createApiServices(request);
  const credentials = createAccountCredentials();
  const response = await services.accounts.create(credentials);

  expect(response.status()).toBe(201);
  const body = await response.json();
  expect(isCreateUserResponse(body)).toBe(true);
  if (!isCreateUserResponse(body)) {
    throw new Error('Create user response does not match the expected API model');
  }
  expect(body.username).toBe(credentials.userName);

  return { userId: body.userID, ...credentials };
}

export async function generateToken(request: APIRequestContext, account: Account): Promise<string> {
  const services = createApiServices(request);
  const response = await services.accounts.generateToken(account);

  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(isTokenResponse(body)).toBe(true);
  if (!isTokenResponse(body)) {
    throw new Error('Generate token response does not match the expected API model');
  }
  expect(body.status).toBe('Success');
  if (!body.token) {
    throw new Error('Generate token response did not include a token');
  }

  return body.token;
}

export async function deleteAccount(
  request: APIRequestContext,
  account: Account,
  token: string,
) {
  const services = createApiServices(request);
  const response = await services.users.delete(account.userId, token);

  expect([200, 204]).toContain(response.status());
}