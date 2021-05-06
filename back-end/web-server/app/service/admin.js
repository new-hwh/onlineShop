'use strict';

const Service = require('egg').Service;
const crypto = require('crypto');

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

class AdminService extends Service {
  //   查询数据库的admin表，验证密码和昵称
  async validAdmin(name, password) {
    const data = await this.ctx.model.Admin.findAll({ attributes: [ 'id', 'name', 'password' ] });
    const pwd = crypto.createHash('md5').update(password).digest('hex');
    for (const item of data) {
      if (item.name === name && item.password === pwd) return this.getAdminById(item.id);
    }
    return false;
  }

  // 获取所有用户
  async getAdmin(data) {
    const ctx = this.ctx;
    // 查询的一些条件写在这
    const { page, size } = data;
    const query = { attributes: { exclude: 'password' }, limit: toInt(size), offset: (toInt(page) - 1) * size };
    return await ctx.model.Admin.findAndCountAll(query);
  }

  //   获取用户，不传id则查询所有
  async getAdminById(id) {
    const ctx = this.ctx;
    // 查询的一些条件写在这
    const query = { attributes: { exclude: 'password' } };
    return await ctx.model.Admin.findByPk(toInt(id), query);

  }

  async getMd5Data(data) {
    return crypto.createHash('md5').update(data).digest('hex');
  }

  async addAdmin(data) {
    const ctx = this.ctx;
    data.password = await this.getMd5Data(data.password);
    await ctx.model.Admin.create(data);
  }

  async updateAdmin(id, data) {
    const { ctx } = this;
    const admin = await ctx.model.Admin.findByPk(toInt(id));
    if (!admin) {
      ctx.status = 404;
      return;
    }
    data.password = await this.getMd5Data(data.password);
    await admin.update(data);
    ctx.status = 200;
  }

  async delAdmin(id) {
    const { ctx } = this;
    const admin = await ctx.model.Admin.findByPk(toInt(id));
    if (!admin) {
      ctx.status = 404;
      return;
    }
    admin.destroy();
    ctx.status = 200;
  }
}

module.exports = AdminService;
