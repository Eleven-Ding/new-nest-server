// 根据不同环境配置选择不同的 config
import devConfigFn from './config.dev';
import prodConfigFn from './config.prod';

const isProd = process.env.NODE_ENV === 'production';

/**
 * @description 根据环境变量读取不同环境配置, 用于 ConfigService
 * @expand 当需要更多的环境时，将获取环境配置的动作通过 NODE_ENV 匹配对应的文件，兜底 prod 和 抛出错误
 */
function getConfigPathByEnv() {
  if (isProd) {
    return prodConfigFn;
  }
  return devConfigFn;
}

export const config = getConfigPathByEnv();
