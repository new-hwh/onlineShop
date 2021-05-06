'use strict';

const Service = require('egg').Service;
const crypto = require('crypto');

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

class UserService extends Service {
  //   查询数据库的admin表，验证密码和昵称
  async validUser(name, password) {
    const data = await this.ctx.model.User.findAll({ attributes: [ 'id', 'name', 'password' ] });
    const pwd = crypto.createHash('md5').update(password).digest('hex');
    for (const item of data) {
      if (item.name === name && item.password === pwd) return await this.getUserById(item.id);
    }
    return false;
  }

  //   获取用户，不传id则查询所有
  async getUser(data) {
    const ctx = this.ctx;
    const { page, size } = data;
    // 查询的一些条件写在这
    const query = {
      attributes: { exclude: [ 'password' ] }, include: [{
        model: ctx.model.Address,
        as: 'address',
        // 副表查询的字段
        attributes: [ 'address_name' ],
      }],
      limit: toInt(size),
      offset: (toInt(page) - 1) * size,
    };
    return await ctx.model.User.findAndCountAll(query);
  }

  async getUserById(id) {
    const { ctx } = this;

    const query = {
      attributes: { exclude: [ 'password' ] }, include: [{
        model: ctx.model.Address,
        as: 'address',
        // 副表查询的字段
        attributes: [ 'address_name' ],
      }],
    };
    return await ctx.model.User.findByPk(toInt(id), query);
  }

  async addUser(data) {
    const { ctx } = this;
    data.password = await this.getMd5Data(data.password);
    await ctx.model.User.create(data);
  }

  async updateUser(id, data) {
    const { ctx } = this;
    data.password = crypto.createHash('md5').update(data.password).digest('hex');
    const user = await ctx.model.User.findByPk(toInt(id));
    if (!user) {
      ctx.status = 404;
      return;
    }
    await user.update(data);
    ctx.status = 200;
  }

  async delUser(id) {
    const { ctx } = this;
    const user = await ctx.model.User.findByPk(toInt(id));
    if (!user) {
      ctx.status = 404;
      return;
    }
    user.destroy();
    ctx.status = 200;
  }

  async getMd5Data(data) {
    return crypto.createHash('md5').update(data).digest('hex');
  }
}

module.exports = UserService;
