import {
  CustomLog,
  EntityCreateTime,
  Metric,
  LogContent,
  LogLevel,
  MetricValue,
  MetricKey,
} from 'src/types';
import { MetricEntity } from './entity/metric.entity';
import { ConsoleLogger, Injectable, LoggerService } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomLogEntity } from './entity/customLog.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
export type CoustomlogData = {
  level: LogLevel;
  payload: Record<string, any>;
  createTime?: EntityCreateTime;
};
// 本地开发就不用查日志了
// 打点 日志
export const MAX_LOG_EXP_COUNT = 10; // 收集10条日志就进行一次存储
export enum SaveLogType {
  CustomLog,
  Metric,
}

@Injectable()
export class MyLoggerService extends ConsoleLogger implements LoggerService {
  // 自定义日志
  private customLogList: CustomLog[] = [];

  private isCustomLogListInSaveProgress = false;

  // 打点
  private metricList: Metric[] = [];
  private isMetricListInSaveProgress = false;

  @InjectRepository(CustomLogEntity)
  customLogEntity: Repository<CustomLogEntity>;

  @InjectRepository(MetricEntity)
  metricEntity: Repository<MetricEntity>;

  log(logContent: LogContent, context?: any, ...rest) {
    this.customLogList.push(
      this.createLogData(logContent, LogLevel.Log, context),
    );
    this.manuallySave();
    super.log(logContent, ...rest);
  }
  warn(logContent: LogContent, context?: any, ...rest) {
    this.customLogList.push(
      this.createLogData(logContent, LogLevel.Warn, context),
    );
    this.manuallySave();
    super.warn(logContent, ...rest);
  }
  error(logContent: LogContent, context?: any, ...rest) {
    this.customLogList.push(
      this.createLogData(logContent, LogLevel.Error, context),
    );
    this.manuallySave();
    super.error(logContent, ...rest);
  }
  debug(logContent: LogContent, context?: any, ...rest) {
    this.customLogList.push(
      this.createLogData(logContent, LogLevel.Debug, context),
    );
    this.manuallySave();
    super.debug(logContent, ...rest);
  }
  metric(metricKey: MetricKey, metricValue: MetricValue): Metric {
    return {
      metricKey,
      metricValue,
      metricTime: Date.now(),
    };
  }

  createLogData(
    logContent: LogContent,
    logLevel: LogLevel,
    context?: any,
  ): CustomLog {
    return {
      logContent,
      logLevel,
      context,
      logTime: Date.now(),
    };
  }
  // 日志达到一定的数量

  async manuallySave() {
    // 如果正在存储的过程中，那么延迟到下一次存储
    // 如果当前没有进行存储，那么就取出 MAX_LOG_EXP_COUNT 位进行存储
    if (
      !this.isCustomLogListInSaveProgress &&
      this.customLogList.length >= MAX_LOG_EXP_COUNT
    ) {
      await this.save(SaveLogType.CustomLog);
    }
    if (
      !this.isMetricListInSaveProgress &&
      this.metricList.length >= MAX_LOG_EXP_COUNT
    ) {
      await this.save(SaveLogType.Metric);
    }
  }
  // 2. 定时任务，每5分钟时间上传一次，如果没超过 30 个
  @Cron(CronExpression.EVERY_5_MINUTES)
  scheduledSave() {
    this.manuallySave();
  }

  // 存储失败进行重试 , //TODO: metric 和 customLog 都使用该方法进行上传
  // TODO: 重试达到一定次数 发送报警(邮箱) 到管理员 停止重试(丢掉日志.....，或者把日志格式化发送到邮箱)
  async save(type: SaveLogType) {
    switch (type) {
      case SaveLogType.CustomLog:
        const dbCustomLogList = this.customLogList.slice(0, MAX_LOG_EXP_COUNT);
        try {
          this.isCustomLogListInSaveProgress = true;
          // TODO: 日志批量存储
          // 存储成功才把缓存的日志删除掉
          this.customLogList.splice(0, MAX_LOG_EXP_COUNT);
        } catch (error) {
          console.error(
            `自定义日志存储失败，已尝试缓存到之后进行存储,errorMsg = ${
              (error as Error).message
            }`,
          );
        } finally {
          this.isCustomLogListInSaveProgress = false;
        }
      case SaveLogType.Metric:
        const dbMetricList = this.metricList.slice(0, MAX_LOG_EXP_COUNT);
        try {
          this.isCustomLogListInSaveProgress = true;
          // TODO: 日志批量存储
          // 存储成功才把缓存的日志删除掉
          this.metricList.splice(0, MAX_LOG_EXP_COUNT);
        } catch (error) {
          console.error(
            `打点信息存储失败，已尝试缓存到之后进行存储,errorMsg = ${
              (error as Error).message
            }`,
          );
        } finally {
          this.isMetricListInSaveProgress = false;
        }
        return;
      default:
        return;
    }
  }
}
