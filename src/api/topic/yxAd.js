import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'admin/ad',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'admin/ad/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'admin/ad',
    method: 'put',
    data
  })
}

export function publish(id) {
  return request({
    url: 'admin/ad/publish/' + id,
    method: 'get'
  })
}

export function get(id) {
  return request({
    url: 'admin/ad/info/' + id,
    method: 'get'
  })
}
