export type LogContent = string;
export type CreateLogTime = Date;
export enum LogLevel {
  Log = 'log',
  Warn = 'warn',
  Error = 'error',
  Debug = 'debug',
}
export type CustomLog = {
  logLevel: LogLevel;
  logContent: LogContent;
  context?: any;
  logTime?: number;
};

export type MetricKey = string;
export type MetricValue = number;

export type Metric = {
  metricKey: MetricKey;
  metricValue: MetricValue;
  metricTime: number;
};
