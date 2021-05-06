'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {

  // 查询所有用户
  async index() {
    const ctx = this.ctx;
    const data = ctx.request.query;
    const res = await ctx.service.user.getUser(data);
    ctx.body = {
      code: 200,
      message: '查询成功',
      data: res,
    };
  }

  // 查询单个用户
  async show() {
    const ctx = this.ctx;
    const data = await ctx.service.user.getUserById(ctx.params.id);
    console.log(ctx.status);
    ctx.body = {
      code: 200,
      message: '查询成功',
      data,
    };
  }

  async create() {
    const ctx = this.ctx;
    const data = ctx.request.body;
    try {
      await ctx.service.user.addUser(data);
      ctx.body = {
        code: 200,
        message: '新增成功',
      };
    } catch (e) {
      ctx.body = {
        code: 401,
        message: e.errors[0].message,
      };
    }


  }

  async update() {
    const ctx = this.ctx;
    const data = ctx.request.body;
    console.log(data);
    await ctx.service.user.updateUser(ctx.params.id, data);
    if (ctx.status === 200) {
      ctx.body = {
        code: 200,
        message: '修改用户成功',
      };
    } else if (ctx.status === 404) {
      ctx.body = {
        code: 404,
        message: '修改用户信息失败，找不到该用户',
      };
    }
  }

  async del() {
    const { ctx } = this;
    await ctx.service.user.delUser(ctx.params.id);
    if (ctx.status === 200) {
      ctx.body = {
        code: 200,
        message: '删除用户成功',
      };
    } else if (ctx.status === 404) {
      ctx.body = {
        code: 404,
        message: '删除用户失败，找不到该用户',
      };
    }
  }


}

module.exports = UserController;
