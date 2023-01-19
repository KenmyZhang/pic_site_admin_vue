import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'admin/topic',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'admin/topic/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'admin/topic',
    method: 'put',
    data
  })
}

export function publish(id) {
  return request({
    url: 'admin/topic/publish/' + id,
    method: 'get'
  })
}

export function get(id) {
  return request({
    url: 'admin/topic/info/' + id,
    method: 'get'
  })
}
