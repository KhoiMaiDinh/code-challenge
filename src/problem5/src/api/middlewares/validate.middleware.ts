import 'reflect-metadata';

import { Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { ClassConstructor, plainToInstance } from 'class-transformer';

import { Errors } from '@/errors/factory';
import { Request } from '@/types/express';

interface ValidateDtoOptions<
  TBody = unknown,
  TParams = unknown,
  TQuery = unknown,
> {
  body?: ClassConstructor<TBody>;
  params?: ClassConstructor<TParams>;
  query?: ClassConstructor<TQuery>;
}

const validateDto = (dtoOptions: ValidateDtoOptions) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const sources: Array<[string, any]> = [
        ['body', dtoOptions.body],
        ['params', dtoOptions.params],
        ['query', dtoOptions.query],
      ];

      for (const [key, DtoClass] of sources) {
        if (!DtoClass) continue;

        const dtoObject = plainToInstance(DtoClass, req[key], {
          enableImplicitConversion: true,
          exposeDefaultValues: true,
        });
        const errors = await validate(dtoObject, {
          whitelist: true,
          forbidNonWhitelisted: true,
        });

        if (errors.length > 0) {
          throw Errors.Common.ValidationFailed({
            violations: errors.map((error) => ({
              field: error.property,
              ...error.constraints,
            })),
          });
        }
        if (key === 'body') {
          (req as Request).dtoBody = dtoObject;
        } else if (key === 'query') {
          (req as Request).dtoQuery = dtoObject;
        } else {
          (req as Request).dtoParams = dtoObject;
        }
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

export default validateDto;
