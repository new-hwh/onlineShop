'use strict';
/* indent size: 2 */

module.exports = app => {
  const { INTEGER, STRING, DATE } = app.Sequelize;

  const GoodsCategory = app.model.define('goods_category', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: STRING(20),
      allowNull: false,
      unique: true,
    },
    pid: INTEGER,
    created_at: DATE,
    updated_at: DATE,
  });

  GoodsCategory.associate = function() {
    app.model.GoodsCategory.hasMany(app.model.Goods, { as: 'goods', foreignKey: 'cate_id', targetKey: 'id' });
  };

  return GoodsCategory;
};
