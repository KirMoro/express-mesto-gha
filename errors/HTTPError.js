import { AppError } from './AppError.js';

export class HTTPError extends AppError {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = 'HTTPError';
  }
}
