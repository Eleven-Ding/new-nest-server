export type LogContent = string;
export type CreateLogTime = Date;
export enum LogLevel {
  Log = 'LOG',
  Warn = 'WARN',
  Error = 'ERROR',
  Debug = 'DEBUG',
}

export type MetricKey = string;
export type MetricValue = number;

export type Metric = {
  metricKey: MetricKey;
  metricValue: MetricValue;
  metricTime: number;
};

// 日志类型
export enum LogType {
  CustomLog = 'custom', // 自定义日志
  Metric = 'metric', // 打点
}

export type CustomLogData = {
  level: LogLevel;
  content: LogContent;
  payload: Payload;
  createTime?: number;
};

export type MetricData = {
  metricKey: MetricKey;
  metricValue: MetricValue;
  payload: Payload;
  createTime?: number;
};
export const MAX_LOG_EXP_COUNT = 10; // 收集10条日志就进行一次存储

export const LogLevelColor = {
  [LogLevel.Log]: '#00ff80',
  [LogLevel.Warn]: '#c99e1d',
  [LogLevel.Error]: '#e00505',
  [LogLevel.Debug]: '#0572e0',
};

export const MetricConsoleColor = '#c91d9e';

export type Payload = Record<
  string,
  string | number | boolean | undefined | null
>;
export type ChalkData = {
  content: string;
  color: string;
};
