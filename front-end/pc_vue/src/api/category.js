import request from '@/utils/request'

export function getCategoryList() {
  return request({
    url: '/goodsCategory',
    method: 'get'
  })
}

export function getFirstCategoryList() {
  return request({
    url: '/firstGoodsCategory',
    method: 'get'
  })
}

export function addCategory(data) {
  return request({
    url: '/goodsCategory',
    method: 'put',
    data
  })
}

export function deleteCategory(id) {
  return request({
    url: `/goodsCategory/${id}`,
    method: 'delete'
  })
}

export function editCategory(id, data) {
  return request({
    url: `/goodsCategory/${id}`,
    method: 'post',
    data
  })
}
