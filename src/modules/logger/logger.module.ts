import { TypeOrmModule } from '@nestjs/typeorm';
import { MyLoggerService } from './logger.service';
import { Module } from '@nestjs/common';
import { CustomLogEntity } from './entity/customLog.entity';
import { MetricEntity } from './entity/metric.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CustomLogEntity, MetricEntity])],
  providers: [MyLoggerService],
  exports: [MyLoggerService],
})
export class LoggerModule {}
