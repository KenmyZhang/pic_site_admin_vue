import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'admin/channel',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'admin/channel/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'admin/channel',
    method: 'put',
    data
  })
}

export function publish(id) {
  return request({
    url: 'admin/channel/publish/' + id,
    method: 'get'
  })
}

export function get(id) {
  return request({
    url: 'admin/channel/info/' + id,
    method: 'get'
  })
}
