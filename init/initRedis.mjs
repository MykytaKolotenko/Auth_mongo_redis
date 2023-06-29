import { Redis } from 'ioredis';
import jsonDataForRedis from './jsonDataforRedis.json' assert { type: 'json' };

const addDataRedis = async (host, port, password) => {
  const redis = new Redis({
    host: host,
    port: +port,
    password: password,
  });

  try {
    jsonDataForRedis.map(async (film) => {
      await redis.sadd('films-set', film.Title);
      await redis.mset(film.Title, JSON.stringify(film));
    });
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

export default addDataRedis;
