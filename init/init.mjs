import { configDotenv } from 'dotenv';
import addDataRedis from './initRedis.mjs';
import addDataMongo from './initMongo.mjs';
configDotenv();

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, MONGODB_URL, SALT_ROUNDS } =
  process.env;

(async () => {
  await addDataRedis(REDIS_HOST, REDIS_PORT, REDIS_PASSWORD);
  console.log('Add films to Redis');
  await addDataMongo(MONGODB_URL, SALT_ROUNDS);
  console.log('Data for MongoDB added successfully');
  process.exit(1);
})();
