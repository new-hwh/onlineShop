'use strict';

module.exports = (options, app) => {
  return async function(ctx, next) {
    // 拿到不需要验证的token的路由
    const routerAuth = app.config.routerAuth;
    // 获取当前路由
    const url = ctx.url;
    // 判断当前路由是否需要验证token
    let flag = routerAuth.includes(url);
    if (url.indexOf('/admin/info') === 0) {
      flag = true;
    }
    if (url.indexOf('/tools') === 0) {
      flag = true;
    }
    if (url.indexOf('/weapp') === 0) {
      flag = true;
    }
    if (flag) {
      await next();
    } else {
      // 获取token,如果没有传入token，则为空
      const token = ctx.headers.authorization ? ctx.headers.authorization : '';
      // 解析token
      if (token) {
        try {
          const decode = await app.jwt.verify(token, app.config.jwt.secret);
          console.log(decode);
          await next();
        } catch (err) {
          ctx.status = 401;
          ctx.body = {
            code: 401,
            message: err.message,
          };
        }
      } else {
        ctx.status = 401;
        ctx.body = {
          code: 401,
          message: '登陆过期或未登陆',
        };
      }
    }
  };
}
;
