'use strict';


module.exports = app => {
  const { INTEGER, STRING, ENUM, DATE, FLOAT } = app.Sequelize;

  const Goods = app.model.define('goods', {
    id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: STRING(50),
      allowNull: false,
    },
    cate_id: {
      type: INTEGER,
      allowNull: false,
    },
    state: {
      type: ENUM('up', 'down'),
      allowNull: false,
      defaultValue: 'down',
    },
    unit_code: {
      type: FLOAT,
      allowNull: false,
    },
    store_num: {
      type: INTEGER,
      allowNull: false,
    },
    sale_num: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    show_pic: {
      type: STRING(255),
      allowNull: true,
    },
    description_pic: {
      type: STRING(255),
      allowNull: true,
    },
    description: {
      type: STRING(255),
      allowNull: true,
    },
    created_at: DATE,
    updated_at: DATE,
  });

  Goods.associate = function() {
    app.model.Goods.belongsTo(app.model.GoodsCategory, { as: 'cate', foreignKey: 'cate_id', targetKey: 'id' });
  };

  return Goods;
};
