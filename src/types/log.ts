export type LogContent = string;
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
  CustomLog = 'Custom', // 自定义日志
  Metric = 'Metric', // 打点
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
export const MAX_LOG_EXP_COUNT = 30; // 收集30条日志就进行一次存储

export const LogLevelColor = {
  [LogLevel.Log]: '#47d147',
  [LogLevel.Warn]: '#c99e1d',
  [LogLevel.Error]: '#cc3300',
  [LogLevel.Debug]: '#0572e0',
};

export const MetricConsoleColor = '#c91d9e';

export const ConsoleTimeColor = '#c5c5c5';

export type Payload = Record<
  string,
  string | number | boolean | undefined | null
>;
export type ChalkData = {
  content: string;
  color: string;
};
