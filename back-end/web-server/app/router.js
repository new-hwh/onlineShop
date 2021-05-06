'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  router.post('/admin/login', controller.admin.login);
  // 查询所有
  router.get('/admin', controller.admin.index);
  // 根据id查用户
  router.get('/admin/:id', controller.admin.show);
  // 新建用户
  router.put('/admin', controller.admin.create);
  // 修改密码
  router.post('/admin/:id', controller.admin.update);
  // 删除管理员
  router.delete('/admin/:id', controller.admin.del);
  // 根据token获取用户信息
  router.get('/admin/info/:token', controller.admin.getInfo);

  // 获取加密后的密码
  router.get('/admin/getMd5/:data', controller.admin.getMd5Data);


  router.get('/goodsCategory', controller.goodsCategory.index);
  router.get('/goodsCategory/:id', controller.goodsCategory.show);
  router.get('/firstGoodsCategory', controller.goodsCategory.getFitst);
  router.put('/goodsCategory', controller.goodsCategory.create);
  router.post('/goodsCategory/:id', controller.goodsCategory.update);
  router.delete('/goodsCategory/:id', controller.goodsCategory.del);


  router.get('/goods', controller.goods.index);
  router.get('/goods/:id', controller.goods.show);
  router.put('/goods', controller.goods.create);
  router.post('/goods/:id', controller.goods.update);
  router.delete('/goods/:id', controller.goods.del);

  // router.post('/user/login', controller.user.login);
  router.get('/user', controller.user.index);
  router.get('/user/:id', controller.user.show);
  router.put('/user', controller.user.create);
  router.post('/user/:id', controller.user.update);
  router.delete('/user/:id', controller.user.del);

  router.get('/address', controller.address.index);
  router.get('/address/:id', controller.address.show);
  router.put('/address', controller.address.create);
  router.post('/address/:id', controller.address.update);
  router.delete('/address/:id', controller.address.del);

  router.get('/order', controller.order.index);
  router.get('/order/:id', controller.order.show);
  router.put('/order', controller.order.create);
  router.post('/order/:id', controller.order.update);
  router.delete('/order/:id', controller.order.del);

  router.get('/orderDetails/:order_id', controller.orderDetails.show);
  router.put('/orderDetails', controller.orderDetails.create);
  router.post('/orderDetails/:id', controller.orderDetails.update);
  router.delete('/orderDetails/:id', controller.orderDetails.del);

  router.post('/tools/uploadShowPic', controller.tools.uploadShowPic);
  router.delete('/tools/delFile', controller.tools.delFile);


  // 微信小程序接口
  router.post('/weapp/login', controller.weapp.login);
  router.put('/weapp/register', controller.user.create);
  router.get('/weapp/getGoodsList', controller.weapp.getGoodsList);
  router.get('/weapp/getCateList', controller.weapp.getCateList);
  router.get('/weapp/getCartList/:id', controller.weapp.getCartList);
  router.post('/weapp/addCart', controller.weapp.addCart);
  router.post('/weapp/updateCart/:id', controller.weapp.updateCart);
  router.delete('/weapp/delCart/:id', controller.weapp.delCart);
  router.get('/weapp/getAddressList', controller.address.index);
  router.post('/weapp/editUser/:id', controller.weapp.updateUser);
  router.get('/weapp/getGoods/:id', controller.goods.show);
  router.post('/weapp/vaildPwd/:id', controller.weapp.vaildPwd);
  router.put('/weapp/createOrder', controller.order.create);
  router.put('/weapp/createOrderDetails', controller.orderDetails.create);
  router.get('/weapp/getOrderList', controller.weapp.getOrderList);
  router.get('/weapp/getOrderDetails/:order_id', controller.orderDetails.show);
};
