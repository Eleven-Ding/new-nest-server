import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { KmsEntity, KmsKey } from './entity/kms.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SmtpConfig } from 'src/types';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { KMS_KEY_EXP_TIME } from 'src/share/constant';

export const SMTP_CONFIG_KEY = 'smtp';
/**
 * 密钥管理，一些密钥都从这里拿，通过 key 的方式
 */
@Injectable()
export class KmsService {
  @InjectRepository(KmsEntity)
  kmsEntity: Repository<KmsEntity>;

  constructor(@InjectRedis() private readonly redis: Redis) {}

  async add(kmsKey: KmsKey, value: string) {
    try {
      const kmsEntity = new KmsEntity();
      kmsEntity.kmsKey = kmsKey;
      kmsEntity.keyValue = value;
      return await this.kmsEntity.save(kmsEntity);
    } catch (error) {
      console.log(
        `添加密钥失败, key=${kmsKey}, errorMsg=${(error as Error).message}`,
      );
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async get<T>(kmsKey: KmsKey): Promise<T> {
    try {
      // TODO: 先从 redis 获取，加快速度，但是考虑一下密钥寸 redis 的风险？
      const redisResult = await this.redis.get(kmsKey);
      if (redisResult) {
        return JSON.parse(redisResult);
      }
      const result = await this.kmsEntity.findOne({
        where: {
          kmsKey,
        },
      });
      if (result) {
        await this.redis.set(kmsKey, result.keyValue, 'EX', KMS_KEY_EXP_TIME);
        return JSON.parse(result.keyValue);
      }
    } catch (error) {
      console.log(
        `获取密钥失败, key=${kmsKey}, errorMsg=${(error as Error).message}`,
      );
    }
  }
  async getSmtpKeyConfig(): Promise<SmtpConfig> {
    const value = await this.get<SmtpConfig>(SMTP_CONFIG_KEY);
    return value;
  }
}
