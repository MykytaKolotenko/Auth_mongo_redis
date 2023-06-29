import { Injectable } from '@nestjs/common';

import { RedisService } from './redis/redis.service';

@Injectable()
export class AppService {
  constructor(private readonly redisClient: RedisService) {}
  async getAllfilms() {
    const list = await this.redisClient.getFilmsList();

    const data: Array<object> = (await this.redisClient.getFilmsData(list)).map(
      (filmData) => JSON.parse(filmData),
    );

    return data;
  }
}
