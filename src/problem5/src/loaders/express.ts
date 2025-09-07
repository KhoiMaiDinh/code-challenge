import express from 'express';
import cors from 'cors';

import routes from '@/api';
import { errorHandler } from '@/api/middlewares';
import config from '@/config';
import { Errors } from '@/errors/factory';
import swaggerDocs from '@/loaders/swagger';
import { corsOptions } from '@/loaders/cors';

export default ({ app }: { app: express.Application }): void => {
  /**
   * Health Check endpoints
   */
  app.get('/status', (_req: express.Request, res: express.Response): void => {
    res.status(200).end();
  });
  app.head('/status', (_req: express.Request, res: express.Response): void => {
    res.status(200).end();
  });

  // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // It shows the real origin IP in the heroku or Cloudwatch logs
  app.enable('trust proxy');

  // The magic package that prevents frontend developers going nuts
  // Alternate description:
  // Enable Cross Origin Resource Sharing to all origins by default
  app.use(cors(corsOptions));

  // Transforms the raw string of req.body into json
  app.use(express.json());

  // Load API routes
  app.use(config.api.prefix, routes());

  // API Documentation
  if (process.env.NODE_ENV === 'development') {
    swaggerDocs(app, config.port);
  }

  /// catch 404 and forward to error handler
  app.use(
    (
      _req: express.Request,
      _res: express.Response,
      _next: express.NextFunction
    ): void => {
      throw Errors.Common.NotFound();
    }
  );

  app.use(errorHandler);
};
