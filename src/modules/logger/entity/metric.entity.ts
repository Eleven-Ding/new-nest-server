import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { EntityCreateTime, MetricKey, MetricValue } from 'src/types';

@Entity('metric')
export class MetricEntity {
  @PrimaryGeneratedColumn()
  metricId: number;

  @Column()
  metricKey: MetricKey;

  @Column()
  metricValue: MetricValue;

  @Column()
  payload: string;
  // 入库时间 并不是打这个点的时间
  @CreateDateColumn()
  serverTime: EntityCreateTime;
}
