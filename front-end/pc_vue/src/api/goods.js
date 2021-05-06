import request from '@/utils/request'

export function getGoodsList(data) {
  return request({
    url: '/goods',
    method: 'get',
    params: data
  })
}

export function getGoods(id) {
  return request({
    url: `/goods/${id}`,
    method: 'get'
  })
}

export function addGoods(data) {
  return request({
    url: '/goods',
    method: 'put',
    data
  })
}

export function delGoods(id) {
  return request({
    url: `/goods/${id}`,
    method: 'delete'
  })
}

export function editGoods(id, data) {
  return request({
    url: `/goods/${id}`,
    method: 'post',
    data
  })
}
