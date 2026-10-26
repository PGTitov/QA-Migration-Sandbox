import { APIRequestContext, APIResponse } from '@playwright/test';
import { getUrl } from '../../config';

type ApiRequestOptions = Parameters<APIRequestContext['get']>[1];

export class ApiClient {
  constructor(private readonly request: APIRequestContext) {}

  get(path: string, options?: ApiRequestOptions): Promise<APIResponse> {
    return this.request.get(getUrl(path), options);
  }

  post(path: string, options?: ApiRequestOptions): Promise<APIResponse> {
    return this.request.post(getUrl(path), options);
  }

  put(path: string, options?: ApiRequestOptions): Promise<APIResponse> {
    return this.request.put(getUrl(path), options);
  }

  delete(path: string, options?: ApiRequestOptions): Promise<APIResponse> {
    return this.request.delete(getUrl(path), options);
  }
}
