export enum HttpMethods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

export interface BackendError {
  message: string;
  title: string;
  statusCode: string;
  translate?: boolean;
  translationParams?: Record<string, any>;
}
