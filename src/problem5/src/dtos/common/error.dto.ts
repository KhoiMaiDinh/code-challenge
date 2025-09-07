import { AppError } from "@/errors/app.error";
import { Expose } from "class-transformer";

/**
 * @openapi
 * components:
 *   schemas:
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *         message:
 *           type: string
 *         details:
 *           type: object
 *           nullable: true
 *         stack:
 *           type: string
 *           nullable: true
 */
export default class ErrorResponse {
  @Expose()
  readonly code: string;

  @Expose()
  readonly message: string;

  @Expose()
  readonly details?: object;

  @Expose()
  readonly stack?: string;

  constructor(code: string, message: string, details?: object, stack?: string) {
    this.code = code;
    this.message = message;
    this.details = details;
    this.stack = stack;
  }

  static fromAppError(appError: AppError): ErrorResponse {
    return new ErrorResponse(
      appError.code,
      appError.message,
      appError.details,
      process.env.NODE_ENV === "development" ? appError.stack : undefined,
    );
  }
}
