'use strict';

const Controller = require('egg').Controller;

class OrderDetailsController extends Controller {

  async show() {
    const { ctx } = this;
    const data = await ctx.service.orderDetails.getOrderDetails(ctx.params.order_id);
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
      await ctx.service.orderDetails.addOrderDetails(data);
      ctx.body = {
        code: 200,
        message: '新增订单详情成功',
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
    await ctx.service.orderDetails.updateOrderDetails(ctx.params.id, data);
    if (ctx.status === 200) {
      ctx.body = {
        code: 200,
        message: '修改订单详情信息成功',
      };
    } else if (ctx.status === 404) {
      ctx.body = {
        code: 404,
        message: '修改订单详情信息失败，找不到该订单详情',
      };
    }
  }

  async del() {
    const { ctx } = this;
    await ctx.service.orderDetails.delOrderDetails(ctx.params.id);
    if (ctx.status === 200) {
      ctx.body = {
        code: 200,
        message: '删除订单详情成功',
      };
    } else if (ctx.status === 404) {
      ctx.body = {
        code: 404,
        message: '删除订单详情失败，找不到该订单详情',
      };
    }
  }
}

module.exports = OrderDetailsController;
