import { RedisModule } from './redis.module';
import { Logger } from '@nestjs/common';

export const redisModule = RedisModule.registerAsync({
  useFactory: async () => {
    const logger = new Logger('RedisModule');

    return {
      connectionOptions: {
        host: process.env.REDIS_HOST,
        port: +process.env.REDIS_PORT,
        pas: process.env.REDIS_PASSWORD,
      },
      onClientReady: (client) => {
        logger.log('Redis client ready');

        client.on('error', (err) => {
          logger.error('Redis Client Error: ', err);
        });

        client.on('connect', () => {
          logger.log(
            `Connected to redis on ${client.options.host}:${client.options.port}`,
          );
        });
      },
    };
  },
});
