import { KmsEntity } from './entity/kms.entity';
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KmsService } from './kms.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([KmsEntity])],
  providers: [KmsService],
  exports: [KmsService],
})
export class KmsModule {}
