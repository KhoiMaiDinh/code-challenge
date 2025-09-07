import { Container } from 'typedi';

import { ModelEntry } from '@/loaders';
import LoggerInstance from '@/loaders/logger';

export default ({ models }: { models: ModelEntry[] }) => {
  try {
    models.forEach((m) => {
      Container.set(m.name, m.model);
    });

    Container.set('logger', LoggerInstance);
  } catch (e) {
    LoggerInstance.error('🔥 Error on dependency injector loader: %o', e);
    throw e;
  }
};
