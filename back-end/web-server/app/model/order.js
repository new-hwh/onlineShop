'use strict';
const uuidv1 = require('uuid/v1');

module.exports = app => {
  const { INTEGER, STRING, ENUM, DATE } = app.Sequelize;

  const Order = app.model.define('order', {
    id: {
      type: STRING(38),
      allowNull: false,
      primaryKey: true,
      defaultValue: () => {
        return uuidv1().replace(/-/g, '');
      },
    },
    user_id: {
      type: INTEGER,
      allowNull: false,
    },
    recevice_name: {
      type: STRING(50),
      allowNull: false,
    },
    recevice_phone: {
      type: STRING(50),
      allowNull: false,
    },
    address_name: {
      type: STRING(255),
      allowNull: false,
    },
    // 备注
    memo: {
      type: STRING(255),
      allowNull: true,
    },
    // 订单状态，0为未发货，1为已发货，2为已送达，3为已完成
    state: {
      type: ENUM('0', '1', '2', '3'),
      allowNull: false,
      defaultValue: '0',
    },
    finished_date: {
      type: DATE,
      allowNull: true,
    },
    created_at: DATE,
    updated_at: DATE,
  });

  Order.associate = function() {
    app.model.Order.belongsTo(app.model.User, { as: 'user', foreignKey: 'user_id', targetKey: 'id' });
  };

  return Order;
};
