import {HTTPError} from "./HTTPError.js";
import {constants} from "http2";

export class BadRequestError extends HTTPError {
  constructor(message) {
    super(message, constants.HTTP_STATUS_BAD_REQUEST);
  };
};
