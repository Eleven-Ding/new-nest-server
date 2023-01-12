export type LogContent = string;
export type CreateLogTime = Date;
export enum LogLevel {
  Log = 'LOG',
  Warn = 'WARN',
  Error = 'ERROR',
  Debug = 'DEBUG',
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
