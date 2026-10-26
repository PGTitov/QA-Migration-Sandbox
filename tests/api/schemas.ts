import {
  ApiErrorResponse,
  BookListResponse,
  BookSummary,
  CreateUserResponse,
  TokenResponse,
  UserProfile,
} from './models';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isBookSummary(value: unknown): value is BookSummary {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isString(value.isbn) &&
    isString(value.title) &&
    isString(value.subTitle) &&
    isString(value.author) &&
    isString(value.publish_date) &&
    isString(value.publisher) &&
    typeof value.pages === 'number' &&
    isString(value.description) &&
    isString(value.website)
  );
}

export function isBookListResponse(value: unknown): value is BookListResponse {
  return (
    isRecord(value) &&
    Array.isArray(value.books) &&
    value.books.every(isBookSummary)
  );
}

export function isCreateUserResponse(value: unknown): value is CreateUserResponse {
  return (
    isRecord(value) &&
    isString(value.userID) &&
    isString(value.username) &&
    Array.isArray(value.books) &&
    value.books.every(isBookSummary)
  );
}

export function isTokenResponse(value: unknown): value is TokenResponse {
  return (
    isRecord(value) &&
    (value.token === null || isString(value.token)) &&
    (value.expires === null || isString(value.expires)) &&
    (value.status === 'Success' || value.status === 'Failed') &&
    isString(value.result)
  );
}

export function isUserProfile(value: unknown): value is UserProfile {
  return (
    isRecord(value) &&
    isString(value.userId) &&
    isString(value.username) &&
    Array.isArray(value.books) &&
    value.books.every(isBookSummary)
  );
}

export function isBookSummaryResponse(value: unknown): value is BookSummary {
  return isBookSummary(value);
}

export function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  return (
    isRecord(value) &&
    isString(value.code) &&
    isString(value.message)
  );
}
