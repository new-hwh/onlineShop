import request from '@/utils/request'

export function getOrderList(data) {
  return request({
    url: '/order',
    method: 'get',
    params: data
  })
}

export function getOrder(id) {
  return request({
    url: `/order/${id}`,
    method: 'get'
  })
}

export function editOrder(id, data) {
  return request({
    url: `/order/${id}`,
    method: 'post',
    data
  })
}
