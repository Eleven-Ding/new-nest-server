// 根据不同环境配置选择不同的 config
import devConfigFn from './config.dev';
import prodConfigFn from './config.prod';

const isProd = process.env.NODE_ENV === 'production';

/**
 * @description 根据环境变量读取不同环境配置, 用于 ConfigService
 */
function getConfigPathByEnv() {
  // 一些配置之后会放到数据库，不使用配置文件，之后改正
  return prodConfigFn;
  if (isProd) {
    return prodConfigFn;
  }
  return devConfigFn;
}

export const config = getConfigPathByEnv();
