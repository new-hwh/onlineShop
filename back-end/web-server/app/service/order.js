'use strict';

const Service = require('egg').Service;

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}


class OrderService extends Service {

  //   查找所有订单信息
  async getOrder(data) {
    const ctx = this.ctx;
    const Op = this.app.Sequelize.Op;
    const { page, size, searchId, state } = data;
    const query = {
      include: [{
        model: ctx.model.User,
        as: 'user',
        attributes: [ 'name' ],
      }],
      where: {
        id: { [Op.like]: `%${searchId}%` },
        state: { [Op.like]: `%${state}%` },
      },
      limit: toInt(size),
      offset: (toInt(page) - 1) * size,
    };
    const res = await ctx.model.Order.findAndCountAll(query);
    return res;
  }

  //   根据id查找订单信息
  async getOrderById(id) {
    const ctx = this.ctx;
    const query = { include: [{
      model: ctx.model.User,
      as: 'user',
      attributes: [ 'name' ],
    }] };
    return await ctx.model.Order.findByPk(toInt(id), query);
  }

  // 新增订单
  async addOrder(data) {
    const { ctx } = this;
    const res = await ctx.model.Order.create(data);
    return res.id;
  }

  async updateOrder(id, data) {
    id = toInt(id);
    const { ctx } = this;
    const order = await ctx.model.Order.findByPk(id);
    if (!order) {
      ctx.status = 404;
      return;
    }
    await order.update(data);
    ctx.status = 200;
  }

  async delOrder(id) {
    const { ctx } = this;
    const order = await this.getOrderById(id);
    if (!order) {
      ctx.status = 404;
      return;
    }
    await order.destroy();
    ctx.status = 200;
  }
}

module.exports = OrderService;
