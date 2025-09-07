import { ERROR_DEFINITIONS } from '@/errors/definition';

type ErrorDefinition = {
  statusCode: number;
  message: string;
};

type NestedKeys<T> = {
  [K in keyof T]: T[K] extends ErrorDefinition
    ? string & K
    : `${string & K}.${NestedKeys<T[K]>}`;
}[keyof T];

type ErrorCode = NestedKeys<typeof ERROR_DEFINITIONS>;
