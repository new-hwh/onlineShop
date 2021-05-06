import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/admin/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: `/admin/info/${token}`,
    method: 'get'
  })
}

export function getAdminList(data) {
  return request({
    url: '/admin',
    method: 'get',
    params: data
  })
}

export function getAdmin(id) {
  return request({
    url: `/admin/${id}`,
    method: 'get'
  })
}

export function addAdmin(data) {
  return request({
    url: '/admin',
    method: 'put',
    data
  })
}

export function delAdmin(id) {
  return request({
    url: `/admin/${id}`,
    method: 'delete'
  })
}

export function updateAdmin(id, data) {
  return request({
    url: `/admin/${id}`,
    method: 'post',
    data
  })
}
