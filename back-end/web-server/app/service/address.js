'use strict';

const Service = require('egg').Service;

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}


class AddressService extends Service {

  //   查找分类返回分类树
  async getAddress() {
    const ctx = this.ctx;
    return await ctx.model.Address.findAll();
  }

  //   查找单个分类信息
  async getAddressById(id) {
    const ctx = this.ctx;
    return await ctx.model.Address.findByPk(toInt(id));
  }

  async addAddress(data) {
    const { ctx } = this;
    await ctx.model.Address.create(data);
  }

  async updateAddress(id, data) {
    const { ctx } = this;
    const address = await ctx.model.Address.findByPk(toInt(id));
    if (!address) {
      ctx.status = 404;
      return;
    }
    await address.update(data);
    ctx.status = 200;
  }

  async delAddress(id) {
    const { ctx } = this;
    const address = await this.getAddressById(id);
    if (!address) {
      ctx.status = 404;
      return;
    }
    address.destroy();
    ctx.status = 200;
  }
}

module.exports = AddressService;
