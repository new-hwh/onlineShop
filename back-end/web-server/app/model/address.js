'use strict';
/* indent size: 2 */

module.exports = app => {
  const { INTEGER, STRING, DATE } = app.Sequelize;

  const Adress = app.model.define('address', {
    id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    address_name: {
      type: STRING(255),
      allowNull: false,
      unique: true,
    },

    created_at: DATE,
    updated_at: DATE,
  });

  Adress.associate = function() {

  };

  return Adress;
};
