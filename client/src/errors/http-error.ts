import BaseError from './base-error';

export default class HttpError extends BaseError {
  name: string;

  constructor(response: Response, body: any) {
    const message = body?.message || `Received status code ${response.status}`;

    super(message);
    this.name = body?.error.name || 'HttpError';
  }
}
