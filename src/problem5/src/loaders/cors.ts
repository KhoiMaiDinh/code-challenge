import { CorsOptions } from 'cors';

import config from '@/config';

export const corsOptions: CorsOptions = {
  origin: config.cors.origin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
