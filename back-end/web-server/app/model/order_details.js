/* indent size: 2 */
'use strict';
module.exports = app => {
  const { INTEGER, DATE, STRING } = app.Sequelize;

  const OrderDetails = app.model.define('order_details', {
    id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    order_id: {
      type: STRING(38),
      allowNull: false,
      unique: true,
    },
    goods_id: {
      type: INTEGER,
      allowNull: false,
    },
    // 商品数量
    goods_num: {
      type: INTEGER,
      allowNull: false,
    },
    created_at: DATE,
    updated_at: DATE,
  });

  OrderDetails.associate = function() {
    app.model.OrderDetails.belongsTo(app.model.Order, { as: 'order', foreignKey: 'order_id', targetKey: 'id' });
    app.model.OrderDetails.belongsTo(app.model.Goods, { as: 'goods', foreignKey: 'goods_id', targetKey: 'id' });
  };

  return OrderDetails;
};
