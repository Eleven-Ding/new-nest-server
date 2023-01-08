import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { EntityCreateTime, LogLevel } from 'src/types';

@Entity('customLog')
export class CustomLogEntity {
  @PrimaryGeneratedColumn()
  logId: number;

  @Column()
  level: LogLevel;

  @Column()
  payload: string;

  // 入库时间 并不是写下这条日志的时间
  @CreateDateColumn()
  serverTime: EntityCreateTime;
}
