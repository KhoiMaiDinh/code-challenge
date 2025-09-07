import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { seedResources } from './seed-resource';

async function seedAll() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) throw new Error('MONGO_URI not defined');

  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');

  console.log('Seeding resources...');
  await seedResources();

  console.log('All seeding completed!');

  await mongoose.disconnect();
}

seedAll().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
