import { ErrorCode, ErrorDefinition } from "@/types/errors";
import { ERROR_DEFINITIONS } from "@/errors/definition";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: ErrorCode;
  public readonly isOperational: boolean;
  public readonly details?: object;

  constructor(code: ErrorCode, overrideMessage?: string, details?: object) {
    const [domain, key] = code.split(".") as [string, string];
    const def = (
      ERROR_DEFINITIONS as Record<string, Record<string, ErrorDefinition>>
    )[domain][key];

    super(overrideMessage ?? def.message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.statusCode = def.statusCode;
    this.code = code;
    this.isOperational = true;
    this.details = details;

    Error.captureStackTrace(this);
  }
}
