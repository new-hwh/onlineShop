'use strict';
/* indent size: 2 */

module.exports = app => {
  const { INTEGER, DATE } = app.Sequelize;

  const Shoppingcarts = app.model.define('shoppingcart', {
    id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    goods_id: {
      type: INTEGER,
      allowNull: false,
    },
    user_id: {
      type: INTEGER,
      allowNull: false,
    },
    goods_num: {
      type: INTEGER,
      allowNull: false,
    },
    created_at: DATE,
    updated_at: DATE,
  });

  Shoppingcarts.associate = function() {
    app.model.Shoppingcart.belongsTo(app.model.User, { as: 'user', foreignKey: 'user_id', targetKey: 'id' });
    app.model.Shoppingcart.belongsTo(app.model.Goods, { as: 'goods', foreignKey: 'goods_id', targetKey: 'id' });
  };

  return Shoppingcarts;
};
