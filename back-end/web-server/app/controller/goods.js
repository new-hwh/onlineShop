'use strict';

const Controller = require('egg').Controller;

class GoodsController extends Controller {
  async index() {
    const { ctx } = this;
    const data = await ctx.service.goods.getGoods(ctx.query);
    ctx.body = {
      code: 200,
      message: '查询成功',
      data,
    };
  }

  async show() {
    const { ctx } = this;
    const data = await ctx.service.goods.getGoodsById(ctx.params.id);
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
      await ctx.service.goods.addGoods(data);
      ctx.body = {
        code: 200,
        message: '新增商品成功',
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
    await ctx.service.goods.updateGoods(ctx.params.id, data);
    if (ctx.status === 200) {
      ctx.body = {
        code: 200,
        message: '修改商品信息成功',
      };
    } else if (ctx.status === 404) {
      ctx.body = {
        code: 404,
        message: '修改商品信息失败，找不到该商品',
      };
    }
  }

  async del() {
    const { ctx } = this;
    await ctx.service.goods.delGoods(ctx.params.id);
    if (ctx.status === 200) {
      ctx.body = {
        code: 200,
        message: '删除商品成功',
      };
    } else if (ctx.status === 404) {
      ctx.body = {
        code: 404,
        message: '删除商品失败，找不到该商品',
      };
    }
  }
}

module.exports = GoodsController;
