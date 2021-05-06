'use strict';

const Controller = require('egg').Controller;

class GoodsCategoryController extends Controller {
  async index() {
    const { ctx } = this;
    const data = await ctx.service.goodsCategory.getGoodsCategory(ctx.query.id);
    ctx.body = {
      code: 200,
      message: '查询成功',
      data,
    };
  }

  async show() {
    const { ctx } = this;
    const data = await ctx.service.goodsCategory.getGoodsCategoryById(ctx.params.id);
    ctx.body = {
      code: 200,
      message: '查询成功',
      data,
    };
  }

  async getFitst() {
    const { ctx } = this;
    const data = await ctx.service.goodsCategory.getFirstGoodCategory();
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
      await ctx.service.goodsCategory.addGoodsCategory(data);
      ctx.body = {
        code: 200,
        message: '新增分类成功',
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
    await ctx.service.goodsCategory.updateGoodsCategory(ctx.params.id, data);
    if (ctx.status === 200) {
      ctx.body = {
        code: 200,
        message: '修改分类成功',
      };
    } else if (ctx.status === 404) {
      ctx.body = {
        code: 404,
        message: '修改分类失败，找不到该分类',
      };
    }
  }

  async del() {
    const { ctx } = this;
    await ctx.service.goodsCategory.delGoodsCategory(ctx.params.id);
    if (ctx.status === 200) {
      ctx.body = {
        code: 200,
        message: '删除分类成功',
      };
    } else if (ctx.status === 404) {
      ctx.body = {
        code: 404,
        message: '删除 分类失败，找不到该分类',
      };
    }
  }
}

module.exports = GoodsCategoryController;
