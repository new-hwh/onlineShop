import request from '@/utils/request'

export function getAddressList() {
  return request({
    url: '/address',
    method: 'get'
  })
}

export function addAddress(data) {
  return request({
    url: '/address',
    method: 'put',
    data
  })
}

export function deleteAddress(id) {
  return request({
    url: `/address/${id}`,
    method: 'delete'
  })
}

export function editAddress(id, data) {
  return request({
    url: `/address/${id}`,
    method: 'post',
    data
  })
}
