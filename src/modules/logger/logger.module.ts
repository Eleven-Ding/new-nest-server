import { TypeOrmModule } from '@nestjs/typeorm';
import { ElevenLoggerService } from './logger.service';
import { Module, Global } from '@nestjs/common';
import { CustomLogEntity } from './entity/customLog.entity';
import { MetricEntity } from './entity/metric.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([CustomLogEntity, MetricEntity])],
  providers: [ElevenLoggerService],
  exports: [ElevenLoggerService],
})
export class LoggerModule {}
