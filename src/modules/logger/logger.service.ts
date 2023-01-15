import {
  ChalkData,
  CustomLogData,
  LogLevelColor,
  LogType,
  MAX_LOG_EXP_COUNT,
  MetricConsoleColor,
  MetricData,
  MetricKey,
  MetricValue,
  Payload,
} from './../../types/log';
import { LogContent, LogLevel } from 'src/types';
import { MetricEntity } from './entity/metric.entity';
import { Injectable, LoggerService, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CustomLogEntity } from './entity/customLog.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConsoleTimeColor } from './../../types/log';
import * as chalk from 'chalk';

@Injectable()
export class ElevenLoggerService implements LoggerService {
  @Inject()
  dataSource: DataSource;

  @InjectRepository(MetricEntity)
  metricEntity: Repository<MetricEntity>;

  @InjectRepository(CustomLogEntity)
  customLogEntity: Repository<CustomLogEntity>;

  // 自定义日志
  private customLogList: CustomLogData[] = [];
  private isCustomLogListInSaveProgress = false;

  // 打点
  private metricList: MetricData[] = [];
  private isMetricListInSaveProgress = false;

  log(logContent: LogContent, context?: Payload) {
    this.createLogData(LogType.CustomLog, logContent, LogLevel.Log, context);
  }
  warn(logContent: LogContent, context?: Payload) {
    this.createLogData(LogType.CustomLog, logContent, LogLevel.Warn, context);
  }
  error(logContent: LogContent, context?: Payload) {
    this.createLogData(LogType.CustomLog, logContent, LogLevel.Error, context);
  }
  debug(logContent: LogContent, context?: Payload) {
    this.createLogData(LogType.CustomLog, logContent, LogLevel.Debug, context);
  }
  metric(metricKey: MetricKey, metricValue: MetricValue, context?: Payload) {
    this.createLogData(LogType.Metric, metricKey, metricValue, context);
  }

  /**
   *  彩色打印，只接受 string 和 对应的 color 其他不用关心
   */
  chalkConsole(chalkConsoleData: ChalkData[]) {
    const consoleStringList: string[] = [];
    chalkConsoleData.forEach(({ color, content }) => {
      consoleStringList.push(chalk.hex(color)(content));
    });
    console.log(consoleStringList.join('   '));
  }

  /**
   * 创建需要打印和存储的数据格式
   */
  createLogData(logType: LogType, ...rest) {
    const chalkConsoleData: ChalkData[] = [];
    if (logType === LogType.CustomLog) {
      const [content, level, payload] = rest;
      this.customLogList.push({
        level,
        content,
        createTime: Date.now(),
        payload,
      });
      chalkConsoleData.push(
        {
          content: `[ ${level} ]`,
          color: LogLevelColor[level],
        },
        {
          content,
          color: LogLevelColor[level],
        },
      );
    } else if (logType === LogType.Metric) {
      const [metricKey, metricValue, payload] = rest;
      this.metricList.push({
        metricKey,
        metricValue,
        createTime: Date.now(),
        payload,
      });
      chalkConsoleData.push(
        {
          content: `[ ${LogType.Metric} ]`,
          color: MetricConsoleColor,
        },
        {
          content: metricKey,
          color: MetricConsoleColor,
        },
        {
          content: metricValue,
          color: MetricConsoleColor,
        },
      );
    }
    chalkConsoleData.push({
      content: new Date().toLocaleString(),
      color: ConsoleTimeColor,
    });
    this.chalkConsole(chalkConsoleData);
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
      this.saveMetrics();
    }
  }
  /**
   * 存储自定义日志，存储失败则重试，暂时无限重试
   */
  saveCustomLogs() {
    // 防止自动触发和手动触发一起，加一个锁判断一下
    if (this.isCustomLogListInSaveProgress) {
      return;
    }
    try {
      this.isCustomLogListInSaveProgress = true;
      const logsWillSaved = this.customLogList.slice(0, MAX_LOG_EXP_COUNT);
      const logsWillSavedEntityList: CustomLogEntity[] = [];
      logsWillSaved.forEach(({ level, content, ...rest }) => {
        const customLogEntity = new CustomLogEntity();
        customLogEntity.level = level;
        customLogEntity.content = content;
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
      console.log(`日志信息存储成功，存储数量 ${logsWillSaved.length}`);
    } catch (error) {
      console.error(
        `自定义日志存储失败，在下一轮存储过程进行重试,errorMsg = ${
          (error as Error).message
        }`,
      );
    } finally {
      this.isCustomLogListInSaveProgress = false;
    }
  }

  /**
   * 存储打点信息
   */
  saveMetrics() {
    if (this.isMetricListInSaveProgress) {
      return;
    }
    try {
      this.isMetricListInSaveProgress = true;
      const metricsWillSaved = this.metricList.slice(0, MAX_LOG_EXP_COUNT);
      const metricsWillSavedEntityList: MetricEntity[] = [];
      metricsWillSaved.forEach(({ metricKey, metricValue, ...rest }) => {
        const metricEntity = new MetricEntity();
        metricEntity.metricKey = metricKey;
        metricEntity.metricValue = metricValue;
        metricEntity.payload = JSON.stringify(rest);
        metricsWillSavedEntityList.push(metricEntity);
      });
      // 这里不阻塞后续的流程，异步挂起就好
      this.dataSource
        .getRepository(MetricEntity)
        .createQueryBuilder()
        .insert()
        .values(metricsWillSavedEntityList)
        .execute();
      this.metricList.splice(0, MAX_LOG_EXP_COUNT);
      console.log(`打点信息存储成功，存储数量 ${metricsWillSaved.length}`);
    } catch (error) {
      console.error(
        `打点信息存储失败，在下一轮存储过程进行重试,errorMsg = ${
          (error as Error).message
        }`,
      );
    } finally {
      this.isMetricListInSaveProgress = false;
    }
  }

  /**
   * 定时任务，如果数量一直没打到，那么就取现存的全部数据进行存储
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  scheduledSave() {
    this.saveCustomLogs();
    this.saveMetrics();
  }
}
