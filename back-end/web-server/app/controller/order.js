'use strict';

const Controller = require('egg').Controller;

class OrderController extends Controller {
  async index() {
    const { ctx } = this;
    console.log(ctx.query);
    const data = await ctx.service.order.getOrder(ctx.query);
    ctx.body = {
      code: 200,
      message: '查询成功',
      data,
    };
  }

  async show() {
    const { ctx } = this;
    const data = await ctx.service.order.getOrderById(ctx.params.id);
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
      const order_id = await ctx.service.order.addOrder(data);
      ctx.body = {
        data: { order_id },
        code: 200,
        message: '新增订单成功',
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
    await ctx.service.order.updateOrder(ctx.params.id, data);
    if (ctx.status === 200) {
      ctx.body = {
        code: 200,
        message: '修改订单信息成功',
      };
    } else if (ctx.status === 404) {
      ctx.body = {
        code: 404,
        message: '修改订单信息失败，找不到该订单',
      };
    }
  }

  async del() {
    const { ctx } = this;
    await ctx.service.order.delOrder(ctx.params.id);
    if (ctx.status === 200) {
      ctx.body = {
        code: 200,
        message: '删除订单成功',
      };
    } else if (ctx.status === 404) {
      ctx.body = {
        code: 404,
        message: '删除订单失败，找不到该订单',
      };
    }
  }
}

module.exports = OrderController;
