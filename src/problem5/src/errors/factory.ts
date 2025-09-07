import { ErrorCode } from "@/types/errors";
import { AppError } from "./app.error";
import { ERROR_DEFINITIONS } from "./definition";
import log from "@/loaders/logger";

type FactoryTree<T> = {
  [K in keyof T]: T[K] extends { statusCode: number; message: string }
    ? (details?: unknown, overrideMessage?: string) => AppError
    : FactoryTree<T[K]>;
};

export const Errors = buildErrorFactory(ERROR_DEFINITIONS) as FactoryTree<
  typeof ERROR_DEFINITIONS
>;

function buildErrorFactory(obj: Record<string, any>, prefix = ""): any {
  return Object.keys(obj).reduce((acc, key) => {
    const path = prefix ? `${prefix}.${key}` : key;
    const val = obj[key];

    acc[key] =
      "statusCode" in val && "message" in val
        ? (details?: object, overrideMessage?: string) => {
            log.debug("Error details:", details);
            return new AppError(path as ErrorCode, overrideMessage, details);
          }
        : buildErrorFactory(val, path);

    return acc;
  }, {} as any);
}
