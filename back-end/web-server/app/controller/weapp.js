'use strict';

const Controller = require('egg').Controller;

class WeappController extends Controller {
  async login() {
    const { ctx } = this;
    const data = ctx.request.body;
    const isValidUser = await ctx.service.user.validUser(data.name, data.password);
    if (isValidUser) {
      ctx.body = {
        code: 200,
        message: '登录成功',
        userInfo: isValidUser,
      };
    } else {
      ctx.body = {
        code: 400,
        message: '登录失败',
      };
    }
  }

  //   获取商品列表
  async getGoodsList() {
    const { ctx } = this;
    const data = await ctx.service.weapp.getGoods(ctx.query);
    ctx.body = {
      code: 200,
      message: '查询成功',
      data,
    };
  }

  // 查询分类列表
  async getCateList() {
    const { ctx } = this;
    const data = await ctx.service.goodsCategory.getGoodsCategory(ctx.query.id);
    ctx.body = {
      code: 200,
      message: '查询成功',
      data,
    };
  }

  // 加入购物车
  async addCart() {
    const { ctx } = this;
    await ctx.service.weapp.addCart(ctx.request.body);
    ctx.body = {
      code: 200,
      message: '添加成功',
    };
  }

  // 获得购物车列表
  async getCartList() {
    const { ctx } = this;
    const data = await ctx.service.weapp.getCartList(ctx.params.id);
    ctx.body = {
      code: 200,
      message: '获取成功',
      data,
    };
  }

  // 更新购物车信息
  async updateCart() {
    const { ctx } = this;
    await ctx.service.weapp.updateCart(ctx.params.id, ctx.request.body);
    if (ctx.status === 200) {
      ctx.body = {
        code: 200,
        message: '修改成功',
      };
    }

  }
  // 删除购物车
  async delCart() {
    const { ctx } = this;
    await ctx.service.weapp.delCart(ctx.params.id);
    if (ctx.status === 200) {
      ctx.body = {
        code: 200,
        message: '删除成功',
      };
    }
  }

  // 更新用户信息
  async updateUser() {
    const ctx = this.ctx;
    const data = ctx.request.body;
    await ctx.service.weapp.updateUser(ctx.params.id, data);
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

  // 检验用户密码用来做支付密码
  async vaildPwd() {
    const { ctx } = this;
    const isValidUser = await ctx.service.weapp.vaildPwd(ctx.params.id, ctx.request.body);
    if (isValidUser) {
      ctx.body = {
        code: 200,
        message: '密码正确',
      };
    } else {
      ctx.body = {
        code: 400,
        message: '密码错误',
      };
    }
  }

  // 获取用户订单列表
  async getOrderList() {
    const { ctx } = this;
    const data = await ctx.service.weapp.getOrder(ctx.query);
    ctx.body = {
      code: 200,
      message: '查询成功',
      data,
    };
  }

  // 获取用户订单列表
  async getOrderDetail() {
    const { ctx } = this;
    const data = await ctx.service.weapp.getOrderDetail(ctx.query);
    ctx.body = {
      code: 200,
      message: '查询成功',
      data,
    };
  }

}

module.exports = WeappController;
