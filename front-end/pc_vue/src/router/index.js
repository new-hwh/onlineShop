import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: '首页',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  {
    path: '/admin',
    component: Layout,
    children: [{
      path: 'index',
      name: '管理员管理',
      component: () => import('@/views/admin'),
      meta: { title: '管理员管理', icon: 'el-icon-user-solid' }
    }]
  },

  {
    path: '/category',
    component: Layout,
    children: [{
      path: 'index',
      name: '分类管理',
      component: () => import('@/views/category'),
      meta: { title: '分类管理', icon: 'el-icon-receiving' }
    }]
  },

  {
    path: '/goods',
    component: Layout,
    redirect: '/goods/list',
    name: 'Goods',
    meta: { title: '商品管理', icon: 'el-icon-goods' },
    children: [
      {
        path: 'list',
        name: '商品管理',
        component: () => import('@/views/goods/goods'),
        meta: { title: '商品列表' }
      },
      {
        path: 'addGoods',
        name: '新增商品',
        hidden: true,
        component: () => import('@/views/goods/addGoods'),
        meta: { title: '新增商品' }
      },
      {
        path: 'editGoods',
        name: '修改商品信息',
        hidden: true,
        component: () => import('@/views/goods/editGoods'),
        meta: { title: '修改商品信息' }
      }
    ]
  },

  {
    path: '/address',
    component: Layout,
    children: [{
      path: 'index',
      name: '收获点管理',
      component: () => import('@/views/address'),
      meta: { title: '收货点管理', icon: 'el-icon-map-location' }
    }]
  },

  {
    path: '/user',
    component: Layout,
    children: [{
      path: 'index',
      name: '用户管理',
      component: () => import('@/views/user'),
      meta: { title: '用户管理', icon: 'el-icon-user' }
    }]
  },

  {
    path: '/order',
    component: Layout,
    children: [{
      path: 'index',
      name: '订单列表',
      component: () => import('@/views/order'),
      meta: { title: '订单列表', icon: 'el-icon-s-order' }
    }]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
