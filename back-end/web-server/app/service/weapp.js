'use strict';

const Service = require('egg').Service;


function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

class WeappService extends Service {
  // 获得商品信息
  async getGoods(data) {
    const ctx = this.ctx;
    const Op = this.app.Sequelize.Op;
    const { cateId, sort, search } = data;


    // 查询的一些条件写在这
    const query = {
      include: [{
        model: ctx.model.GoodsCategory,
        as: 'cate',
        // 副表查询的字段
        attributes: [ 'name' ],
      }],
      // limit: toInt(size),
      // offset: (toInt(page) - 1) * size,
      where: {
        state: 'up',
        name: { [Op.like]: `%${search}%` },
      },
    };

    // 如果有传来分类ID
    if (cateId) {
      query.where.cate_id = cateId;
    }

    // 排序查找
    if (toInt(sort) === 1) {
      query.order = [
        [ 'unit_code', 'ASC' ],
      ];
    } else if (toInt(sort) === 2) {
      query.order = [
        [ 'sale_num', 'DESC' ],
      ];
    }

    const result = await ctx.model.Goods.findAndCountAll(query);
    return result;
  }

  async addCart(data) {
    const { ctx } = this;
    data.goods_num = 1;
    const result = await this.getCartList(data.user_id);
    for (const item of result) {
      if (data.goods_id === item.goods_id) {
        data.goods_num = item.goods_num + 1;
        const cart = await ctx.model.Shoppingcart.findByPk(item.id);
        return await cart.update(data);
      }
    }
    await ctx.model.Shoppingcart.create(data);
  }

  async getCartList(id) {
    const { ctx } = this;
    // 查询条件
    const query = {
      where: {
        user_id: toInt(id),
      },
      include: [{
        model: ctx.model.Goods,
        as: 'goods',
      }],
    };
    return await ctx.model.Shoppingcart.findAll(query);
  }

  async updateCart(id, data) {
    const { ctx } = this;
    const cart = await ctx.model.Shoppingcart.findByPk(toInt(id));
    if (!cart) {
      ctx.status = 404;
      return;
    }
    await cart.update(data);
    ctx.status = 200;

  }

  async delCart(id) {
    const { ctx } = this;
    const cart = await ctx.model.Shoppingcart.findByPk(toInt(id));
    if (!cart) {
      ctx.status = 404;
      return;
    }
    await cart.destroy();
    ctx.status = 200;
  }

  async updateUser(id, data) {
    const { ctx } = this;
    console.log(data);
    const user = await ctx.model.User.findByPk(toInt(id));
    if (!user) {
      ctx.status = 404;
      return;
    }
    await user.update(data);
    ctx.status = 200;
  }

  async vaildPwd(id, data) {
    const { ctx } = this;
    const pwd = await ctx.service.user.getMd5Data(data.password);
    const query = {
      attributes: [ 'id', 'password' ],
    };
    const user = await ctx.model.User.findByPk(toInt(id), query);
    console.log(user.password, pwd);
    if (user.password === pwd) {
      return true;
    }
    return false;
  }

  //   查找该用户的订单信息
  async getOrder(data) {
    const ctx = this.ctx;
    const Op = this.app.Sequelize.Op;
    const { user_id, state } = data;
    const query = {
      order: [
        [ 'created_at', 'DESC' ],
      ],
      where: {
        user_id: toInt(user_id),
        state: { [Op.like]: `%${state}%` },
      },
    };
    const res = await ctx.model.Order.findAll(query);
    return res;
  }

}

module.exports = WeappService;
