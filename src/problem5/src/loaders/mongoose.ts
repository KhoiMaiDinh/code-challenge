import mongoose from 'mongoose';
import { Db } from 'mongodb';
import config from '@/config';

export default async (): Promise<Db> => {
  const connection = await mongoose.connect(config.databaseURL, {
    serverSelectionTimeoutMS: 5000,
    autoIndex: false,
  });
  return connection.connection.db;
};
