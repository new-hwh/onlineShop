import request from '@/utils/request'

export function getUserList(data) {
  return request({
    url: '/user',
    method: 'get',
    params: data
  })
}

export function getUser(id) {
  return request({
    url: `/user/${id}`,
    method: 'get'
  })
}

export function addUser(data) {
  return request({
    url: '/user',
    method: 'put',
    data
  })
}

export function delUser(id) {
  return request({
    url: `/user/${id}`,
    method: 'delete'
  })
}

export function updateUser(id, data) {
  return request({
    url: `/user/${id}`,
    method: 'post',
    data
  })
}
