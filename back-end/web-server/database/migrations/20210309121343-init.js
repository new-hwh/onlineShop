'use strict';

const uuidv1 = require('uuid/v1');

module.exports = {
  // 在执行数据库升级时调用的函数，创建 users 表
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING, ENUM, FLOAT } = Sequelize;
    await queryInterface.createTable('admin', {
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

    await queryInterface.createTable('user', {
      id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: STRING(20),
        allowNull: false,
      },
      password: {
        type: STRING(100),
        allowNull: false,
      },

      email: STRING(60),
      phone: STRING(20),
      address_id: INTEGER,

      avatar_img: STRING(255),

      created_at: DATE,
      updated_at: DATE,
    });

    await queryInterface.createTable('goods_category', {
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

    await queryInterface.createTable('goods', {
      id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: STRING(20),
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

    await queryInterface.createTable('order', {
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
      has_send: {
        type: ENUM('1', '0'),
        allowNull: false,
        defaultValue: '0',
      },
      ship_date: {
        type: DATE,
        allowNull: true,
      },
      has_recevice: {
        type: ENUM('1', '0'),
        allowNull: false,
        defaultValue: '0',
      },
      created_at: DATE,
      updated_at: DATE,
    });

    await queryInterface.createTable('order_details', {
      id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      order_id: {
        type: STRING(38),
        allowNull: false,
      },
      goods_id: {
        type: INTEGER,
        allowNull: false,
      },
      // 商品数量
      good_num: {
        type: INTEGER,
        allowNull: false,
      },
      created_at: DATE,
      updated_at: DATE,
    });

    await queryInterface.createTable('shoppingcart', {
      id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      goods_id: {
        type: INTEGER,
        allowNull: false,
        references: {
          model: 'goods',
          key: 'id',
        },
      },
      user_id: {
        type: INTEGER,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id',
        },
      },
      goods_num: {
        type: INTEGER,
        allowNull: false,
      },
      created_at: DATE,
      updated_at: DATE,
    });

    await queryInterface.createTable('address', {
      id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      address_name: {
        type: STRING(255),
        allowNull: false,
      },

      created_at: DATE,
      updated_at: DATE,
    });

    // 创建一个超级管理员;
    await queryInterface.bulkInsert('admin', [{
      name: 'admin',
      password: '21232f297a57a5a743894a0e4a801fc3', // 密码是加密后的admin
      role_type: 'superAdmin',
      state: '1',
      created_at: new Date(),
      updated_at: new Date(),
    }]);
  },
  // 在执行数据库降级时调用的函数，删除 users 表
  down: async queryInterface => {
    await queryInterface.dropTable('admin');
  },
};
