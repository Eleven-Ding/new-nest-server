import { Metric } from './../../types/log';
import {
  CustomLog,
  EntityCreateTime,
  LogContent,
  LogLevel,
  MetricValue,
  MetricKey,
} from 'src/types';
import { MetricEntity } from './entity/metric.entity';
import { Injectable, LoggerService, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CustomLogEntity } from './entity/customLog.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as chalk from 'chalk';
export type CoustomlogData = {
  level: LogLevel;
  payload: Record<string, any>;
  createTime?: EntityCreateTime;
};
export const MAX_LOG_EXP_COUNT = 3; // 收集10条日志就进行一次存储
export enum SaveLogType {
  CustomLog,
  Metric,
}
export const LogLevelColor = {
  [LogLevel.Log]: '#00ff80',
  [LogLevel.Warn]: '#c99e1d',
  [LogLevel.Error]: '#e00505',
  [LogLevel.Debug]: '#0572e0',
};

export type LogContext = Record<
  string,
  string | number | boolean | undefined | null
>;
@Injectable()
export class ElevenLoggerService implements LoggerService {
  @Inject()
  dataSource: DataSource;

  @InjectRepository(CustomLogEntity)
  customLogEntity: Repository<CustomLogEntity>;

  @InjectRepository(MetricEntity)
  metricEntity: Repository<MetricEntity>;

  // 自定义日志
  private customLogList: CustomLog[] = [];
  private isCustomLogListInSaveProgress = false;

  // 打点
  private metricList: Metric[] = [];
  private isMetricListInSaveProgress = false;

  // 特化，处在哪个上下文名称
  private contextName: string;

  log(logContent: LogContent, context?: LogContext) {
    this.createLogData(logContent, LogLevel.Log, context);
  }
  warn(logContent: LogContent, ...rest) {
    this.createLogData(logContent, LogLevel.Warn, rest);
  }
  error(logContent: LogContent, ...rest) {
    this.createLogData(logContent, LogLevel.Error, rest);
  }
  debug(logContent: LogContent, ...rest) {
    this.createLogData(logContent, LogLevel.Debug, rest);
  }
  metric(metricKey: MetricKey, metricValue: MetricValue) {
    this.metricList.push({
      metricKey,
      metricValue,
      metricTime: Date.now(),
    });
    this.manuallySave();
  }
  chalkConsole(logContext: LogContent, logLevel: LogLevel) {
    console.log(
      chalk.hex(LogLevelColor[logLevel])(`[ ${logLevel} ] ${logContext}`),
      chalk.yellow(`[ ${this.contextName} ]`),
      chalk.green(new Date().toLocaleString()),
    );
  }

  public setContextName(contextName: string) {
    this.contextName = contextName;
  }

  /**
   * 创建自定义日志数据
   */
  createLogData(logContent: LogContent, logLevel: LogLevel, context?: any) {
    this.customLogList.push({
      logContent,
      logLevel,
      context: {
        contextName: this.contextName,
        ...context,
      },
      logTime: Date.now(),
    });
    this.chalkConsole(logContent, logLevel);
    this.manuallySave();
  }

  /**
   * 存储数据
   */
  manuallySave() {
    if (
      !this.isCustomLogListInSaveProgress &&
      this.customLogList.length >= MAX_LOG_EXP_COUNT
    ) {
      this.saveCustomLogs();
    }
    if (
      !this.isMetricListInSaveProgress &&
      this.metricList.length >= MAX_LOG_EXP_COUNT
    ) {
      this.saveMetric();
    }
  }
  // 2. 定时任务，每5分钟时间上传一次，如果没超过 30 个

  saveMetric() {
    try {
      const metricWillSaved = this.metricList.slice(0, MAX_LOG_EXP_COUNT);
      // TODO: 日志批量存储
      this.metricList.splice(0, MAX_LOG_EXP_COUNT);
    } catch (error) {
      console.error(
        `自定义日志缓存失败，在下一轮存储过程进行重试,errorMsg = ${
          (error as Error).message
        }`,
      );
    } finally {
      this.isCustomLogListInSaveProgress = false;
    }
  }

  /**
   * 存储自定义日志，存储失败则重试，暂时无限重试
   */
  saveCustomLogs() {
    try {
      const logsWillSaved = this.customLogList.slice(0, MAX_LOG_EXP_COUNT);
      const logsWillSavedEntityList: CustomLogEntity[] = [];
      logsWillSaved.forEach(({ logLevel, logContent, ...rest }) => {
        const customLogEntity = new CustomLogEntity();
        customLogEntity.level = logLevel;
        customLogEntity.logContext = logContent;
        customLogEntity.payload = JSON.stringify(rest);
        logsWillSavedEntityList.push(customLogEntity);
      });
      // 这里不阻塞后续的流程，异步挂起就好
      this.dataSource
        .getRepository(CustomLogEntity)
        .createQueryBuilder()
        .insert()
        .values(logsWillSavedEntityList)
        .execute();
      this.customLogList.splice(0, MAX_LOG_EXP_COUNT);
    } catch (error) {
      console.error(
        `自定义日志缓存失败，在下一轮存储过程进行重试,errorMsg = ${
          (error as Error).message
        }`,
      );
    } finally {
      this.isCustomLogListInSaveProgress = false;
    }
  }
  /**
   * 定时任务，如果数量一直没打到，那么就取现存的全部数据进行存储
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  scheduledSave() {
    console.log('自动存储');
    this.manuallySave();
  }
}
