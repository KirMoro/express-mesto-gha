import { AppError } from './AppError.js';

export class HTTPError extends AppError {
  constructor(message, statusCode) {
    super(message);
    this.status = statusCode;
    this.name = 'HTTPError';
  }
}
