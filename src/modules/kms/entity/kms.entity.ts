import { IsNotEmpty } from 'class-validator';
import { Column, Entity, PrimaryColumn } from 'typeorm';

export type KmsKey = string;
export type KmsValue = string;
@Entity('kms')
export class KmsEntity {
  @PrimaryColumn()
  @IsNotEmpty()
  kmsKey: KmsKey;

  @Column()
  @IsNotEmpty()
  keyValue: KmsValue;
}
