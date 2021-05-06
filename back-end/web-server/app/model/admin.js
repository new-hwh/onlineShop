'use strict';

module.exports = app => {
  const { INTEGER, STRING, ENUM, DATE } = app.Sequelize;

  const Admin = app.model.define('admin', {
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
    role_type: {
      type: ENUM('admin', 'superAdmin'),
      allowNull: true,
      defaultValue: 'admin',
    },
    state: {
      type: ENUM('0', '1'),
      allowNull: true,
      defaultValue: '1',
    },
    created_at: DATE,
    updated_at: DATE,
  });

  Admin.associate = function() {

  };

  return Admin;
};
