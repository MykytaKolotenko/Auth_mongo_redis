import { Inject, Injectable } from '@nestjs/common';
import { IORedisKey } from '../redis/redis.module';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject(IORedisKey) private readonly redisClient: Redis) {}
  async getFilmsList(): Promise<Array<string>> {
    return await this.redisClient.sinter('films-set');
  }

  async getFilmsData(arr: Array<string>): Promise<Array<string>> {
    const arrPromise = arr.map((filmName) => {
      return this.redisClient.get(filmName);
    });
    const data = await Promise.all(arrPromise);
    return data;
  }
}
