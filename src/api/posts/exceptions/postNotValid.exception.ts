
import { ValidationError } from "yup";
import HttpException from "../../../lib/httpException";
 
export default class PostNotValidException extends HttpException {
  constructor(error: ValidationError) {
    super(400, error.errors.join(', '));
  }
}