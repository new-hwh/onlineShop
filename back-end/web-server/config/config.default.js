/* eslint valid-jsdoc: "off" */
'use strict';


/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_123456';

  config.sequelize = {
    dialect: 'mysql',
    host: '127.0.0.1',
    username: 'root',
    password: 'root',
    port: 3306,
    database: 'onlineshop',
    timezone: '+08:00',
    define: {
      raw: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      freezeTableName: true,
      underscored: false,
    },
  };

  config.routerAuth = [ '/admin/login', '/admin/info', '/admin/getMd5/admin', '/user/login' ];

  config.uploadDir = 'app/public/upload';

  config.multipart = {
    mode: 'file',
  };

  // 安全配置
  config.security = {
    // domainWhiteList: [ 'http://localhost:9527' ],
    csrf: {
      enable: false,
      ignoreJSON: true,
    },
    // 允许访问接口的白名单
    domainWhiteList: [ 'http://localhost:80' ],
  };

  config.jwt = {
    secret: 'b1uuuue_hwh',
  };

  // 跨域配置
  config.cors = {
    origin: '*',
    allowMethods: 'GET,POST,PUT,DELETE,HEAD,PATCH',
  };

  // add your middleware config here
  config.middleware = [ 'auth', 'errorHandle' ];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
