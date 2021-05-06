'use strict';

const Service = require('egg').Service;

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}


class OrderDetailsService extends Service {

  //   根据order_id查找订单详情信息
  async getOrderDetails(order_id) {
    const ctx = this.ctx;
    const query = {
      include: [
        {
          model: ctx.model.Goods,
          as: 'goods',
        },
      ],
      where: { order_id },
    };
    const data = await ctx.model.OrderDetails.findAll(query);
    return data;
  }

  // 新增订单详情
  async addOrderDetails(data) {
    const { ctx } = this;
    await ctx.model.OrderDetails.create(data);
  }

  async updateOrderDetails(id, data) {
    id = toInt(id);
    const { ctx } = this;
    const orderDetails = await ctx.model.OrderDetails.findByPk(id);
    if (!orderDetails) {
      ctx.status = 404;
      return;
    }
    await orderDetails.update(data);
    ctx.status = 200;
  }

  async delOrderDetails(id) {
    const { ctx } = this;
    const orderDetails = await this.getOrderDetailsById(id);
    if (!orderDetails) {
      ctx.status = 404;
      return;
    }
    orderDetails.destroy();
    ctx.status = 200;
  }
}

module.exports = OrderDetailsService;
