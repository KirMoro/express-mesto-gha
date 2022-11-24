import { constants } from 'http2';
import { HTTPError } from './HTTPError.js';

export class ServerError extends HTTPError {
  constructor() {
    super('Неизвестная ошибка.', constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
  }
}
