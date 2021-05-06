'use strict';
/* indent size: 2 */

module.exports = app => {
  const { INTEGER, STRING, DATE, ENUM } = app.Sequelize;

  const User = app.model.define('user', {
    id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: STRING(20),
      allowNull: false,
      unique: true,
    },
    password: {
      type: STRING(100),
      allowNull: false,
    },
    sex: ENUM('0', '1'),
    email: STRING(60),
    phone: STRING(20),
    address_id: INTEGER,
    state: {
      type: ENUM('0', '1'),
      allowNull: false,
      defaultValue: '1',
    },
    avatar_img: STRING(255),

    created_at: DATE,
    updated_at: DATE,
  });

  User.associate = function() {
    app.model.User.hasMany(app.model.Order, { as: 'order', foreignKey: 'user_id', targetKey: 'id' });
    app.model.User.belongsTo(app.model.Address, { as: 'address', foreignKey: 'address_id', targetKey: 'id' });
  };

  return User;
};
