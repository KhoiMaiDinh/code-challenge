import { Request as ExpressRequest } from 'express';

export interface Request<TBody = unknown, TParams = unknown, TQuery = unknown>
  extends ExpressRequest {
  dtoBody?: TBody;
  dtoParams?: TParams;
  dtoQuery?: TQuery;
}
