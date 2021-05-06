import request from '@/utils/request'

export function getOrderDetailList(id) {
  return request({
    url: `/orderDetails/${id}`,
    method: 'get'
  })
}
