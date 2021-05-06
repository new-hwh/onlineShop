'use strict';

const Service = require('egg').Service;

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}


class GoodsCategoryService extends Service {

  // 如果不传入id，则查询所有分类及其子分类，如果有id的话，则查询id所值的分类和其子分类
  bulidCategoryTree(id, data) {
    const res = [];
    id = toInt(id);

    // 定义获取子节点函数
    function getNode(id, data) {
      const node = [];
      for (const item of data) {
        if (item.dataValues.pid === id) {
          node.push(item);
          getNode(item.dataValues.id, data);
        }
      }
      if (node.length === 0) return;
      return node;
    }


    if (!id) {
      for (const item of data) {
        if (!item.dataValues.pid) {
          item.dataValues.children = getNode(item.dataValues.id, data);
          res.push(item);
        }
      }
    } else {
      for (const item of data) {
        if (item.dataValues.id === id) {
          item.dataValues.children = getNode(item.dataValues.id, data);
          res.push(item);
        }
      }
    }
    return res;
  }

  getChildrenIds(treeData) {
    const res = [];
    function getIds(treeData, res) {
      for (const item of treeData) {
        res.push(item.dataValues.id);
        if (item.dataValues.children) {
          getIds(item.dataValues.children, res);
        }
      }
    }
    getIds(treeData, res);
    return res;
  }

  async getFirstGoodCategory() {
    const { ctx } = this;
    const res = [];
    const data = await ctx.model.GoodsCategory.findAll();
    for (const item of data) {
      if (!item.dataValues.pid) {
        res.push(item);
      }
    }
    return res;
  }

  //   查找分类返回分类树
  async getGoodsCategory(id) {
    id = toInt(id);
    const ctx = this.ctx;
    const data = await ctx.model.GoodsCategory.findAll();
    return this.bulidCategoryTree(id, data);
  }

  //   查找单个分类信息
  async getGoodsCategoryById(id) {
    id = toInt(id);
    const ctx = this.ctx;
    return await ctx.model.GoodsCategory.findByPk(id);
  }

  async addGoodsCategory(data) {
    const { ctx } = this;
    if (!data.pid) {
      delete data.pid;
    }
    await ctx.model.GoodsCategory.create(data);
  }

  async updateGoodsCategory(id, data) {
    id = toInt(id);
    const { ctx } = this;
    console.log(data);
    if (!data.pid) {
      data.pid = null;
    }
    const goodCategory = await ctx.model.GoodsCategory.findByPk(id);
    if (!goodCategory) {
      ctx.status = 404;
      return;
    }
    await goodCategory.update(data);
    ctx.status = 200;
  }

  async delGoodsCategory(id) {
    const { ctx } = this;
    const goodCategory = await this.getGoodsCategoryById(id);
    const goodCategoryTree = await this.getGoodsCategory(id);
    console.log(goodCategoryTree);
    if (!goodCategory) {
      ctx.status = 404;
      return;
    }

    const ids = this.getChildrenIds(goodCategoryTree);
    for (const i of ids) {
      const res = await ctx.model.GoodsCategory.findByPk(i);
      res.destroy();
    }
    ctx.status = 200;
  }
}

module.exports = GoodsCategoryService;
