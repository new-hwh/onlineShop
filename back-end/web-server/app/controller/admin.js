'use strict';

const Controller = require('egg').Controller;

class AdminController extends Controller {
  async login() {
    const { ctx, app } = this;
    const data = ctx.request.body;
    const isValidAdmin = await ctx.service.admin.validAdmin(data.name, data.password);
    if (isValidAdmin) {
      const token = app.jwt.sign({ isValidAdmin }, app.config.jwt.secret, { expiresIn: '36h' });
      ctx.body = {
        code: 200,
        message: '登录成功',
        token,
      };
    } else {
      ctx.body = {
        code: 400,
        message: '登录失败',
      };
    }
  }

  async getInfo() {
    const { app, ctx } = this;
    const token = ctx.params.token;
    const info = await app.jwt.verify(token, app.config.jwt.secret);
    ctx.body = {
      code: 200,
      message: '获取成功',
      data: info.isValidAdmin,
    };
  }


  // 查询所有用户
  async index() {
    const ctx = this.ctx;
    const query = ctx.query;
    const data = await ctx.service.admin.getAdmin(query);
    ctx.body = {
      code: 200,
      message: '查询成功',
      data: data.rows,
      total: data.count,
    };
  }

  // 查询单个用户
  async show() {
    const ctx = this.ctx;
    const data = await ctx.service.admin.getAdminById(ctx.params.id);
    console.log(ctx.status);
    if (!data) {
      ctx.body = {
        code: ctx.status,
        message: '找不到该用户',
      };
    } else {
      ctx.body = {
        code: 200,
        message: '查询成功',
        data,
      };
    }

  }

  async create() {
    const ctx = this.ctx;
    const data = ctx.request.body;
    await ctx.service.admin.addAdmin(data);
    ctx.body = {
      code: 200,
      message: '新增成功',
    };
  }

  async update() {
    const ctx = this.ctx;
    const data = ctx.request.body;
    await ctx.service.admin.updateAdmin(ctx.params.id, data);
    if (ctx.status === 200) {
      ctx.body = {
        code: 200,
        message: '修改管理员成功',
      };
    } else if (ctx.status === 404) {
      ctx.body = {
        code: 404,
        message: '修改管理员失败，找不到该管理员',
      };
    }
  }

  async del() {
    const { ctx } = this;
    await ctx.service.admin.delAdmin(ctx.params.id);
    if (ctx.status === 200) {
      ctx.body = {
        code: 200,
        message: '删除管理员成功',
      };
    } else if (ctx.status === 404) {
      ctx.body = {
        code: 404,
        message: '删除管理员失败，找不到该管理员',
      };
    }
  }

  async getMd5Data() {
    const { ctx } = this;
    ctx.body = await ctx.service.admin.getMd5Data(ctx.params.data);
  }


}

module.exports = AdminController;
