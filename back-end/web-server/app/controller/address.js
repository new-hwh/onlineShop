'use strict';

const Controller = require('egg').Controller;

class AddressController extends Controller {
  async index() {
    const { ctx } = this;
    const data = await ctx.service.address.getAddress(ctx.query.id);
    ctx.body = {
      code: 200,
      message: '查询成功',
      data,
    };
  }

  async show() {
    const { ctx } = this;
    const data = await ctx.service.address.getAddressById(ctx.params.id);
    ctx.body = {
      code: 200,
      message: '查询成功',
      data,
    };
  }

  async create() {
    const { ctx } = this;
    const data = ctx.request.body;
    try {
      await ctx.service.address.addAddress(data);
      ctx.body = {
        code: 200,
        message: '新增收货点成功',
      };
    } catch (e) {
      ctx.body = {
        code: 401,
        message: e.message,
      };
    }
  }

  async update() {
    const { ctx } = this;
    const data = ctx.request.body;
    await ctx.service.address.updateAddress(ctx.params.id, data);
    if (ctx.status === 200) {
      ctx.body = {
        code: 200,
        message: '修改收货点成功',
      };
    } else if (ctx.status === 404) {
      ctx.body = {
        code: 404,
        message: '修改收货点失败，找不到该收货点',
      };
    }
  }

  async del() {
    const { ctx } = this;
    await ctx.service.address.delAddress(ctx.params.id);
    if (ctx.status === 200) {
      ctx.body = {
        code: 200,
        message: '删除收货点成功',
      };
    } else if (ctx.status === 404) {
      ctx.body = {
        code: 404,
        message: '删除 收货点失败，找不到该收货点',
      };
    }
  }
}

module.exports = AddressController;
