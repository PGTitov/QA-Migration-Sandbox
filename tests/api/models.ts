export interface AccountCredentials {
  userName: string;
  password: string;
}

export interface CreateUserResponse {
  userID: string;
  username: string;
  books: BookSummary[];
}

export interface TokenResponse {
  token: string | null;
  expires: string | null;
  status: 'Success' | 'Failed';
  result: string;
}

export interface BookSummary {
  isbn: string;
  title: string;
  subTitle: string;
  author: string;
  publish_date: string;
  publisher: string;
  pages: number;
  description: string;
  website: string;
}

export interface BookListResponse {
  books: BookSummary[];
}

export interface UserProfile {
  userId: string;
  username: string;
  books: BookSummary[];
}

export interface AddBooksRequest {
  userId: string;
  collectionOfIsbns: Array<{ isbn: string }>;
}

export interface DeleteBookRequest {
  userId: string;
  isbn: string;
}

export interface DeleteBooksRequest {
  userId: string;
}

export interface ReplaceBookRequest {
  userId: string;
  isbn: string;
}

export interface ApiErrorResponse {
  code: string;
  message: string;
}
