export default () => ({
  typeorm: {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'dsy19991030.',
    database: 'blog',
    synchronize: true,
  },
  smtp: {
    user: '1559298665@qq.com',
    pass: 'escsvblwornshdai',
  },
  redis: {
    config: {
      host: 'localhost',
      port: 6379,
    },
  },
  jwt: {
    secret: 'elevendingshiyi',
    expiresIn: '7d',
  },
});
