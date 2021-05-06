'use strict';

const Service = require('egg').Service;

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}


class GoodsService extends Service {

  //   查找所有商品信息
  async getGoods(data) {
    const ctx = this.ctx;
    const Op = this.app.Sequelize.Op;
    const { page, size, search } = data;
    // 查询的一些条件写在这
    const query = {
      include: [{
        model: ctx.model.GoodsCategory,
        as: 'cate',
        // 副表查询的字段
        attributes: [ 'name' ],
      }],
      limit: toInt(size),
      offset: (toInt(page) - 1) * size,
      where: {
        name: {
          [Op.like]: `%${search}%`,
        },
      },
    };
    const result = await ctx.model.Goods.findAndCountAll(query);
    return result;
  }

  //   根据id查找商品信息
  async getGoodsById(id) {
    id = toInt(id);
    const ctx = this.ctx;
    const query = {
      include: [{
        model: ctx.model.GoodsCategory,
        as: 'cate',
        // 副表查询的字段
        attributes: [ 'name' ] }],
    };
    return await ctx.model.Goods.findByPk(id, query);
  }

  // 新增商品
  async addGoods(data) {
    const { ctx } = this;
    await ctx.model.Goods.create(data);
  }

  async updateGoods(id, data) {
    id = toInt(id);
    const { ctx } = this;
    const goods = await ctx.model.Goods.findByPk(id);
    if (!goods) {
      ctx.status = 404;
      return;
    }
    await goods.update(data);
    ctx.status = 200;
  }

  async delGoods(id) {
    const { ctx } = this;
    const goods = await this.getGoodsById(id);
    if (!goods) {
      ctx.status = 404;
      return;
    }
    await goods.destroy();
    ctx.status = 200;
  }
}

module.exports = GoodsService;
