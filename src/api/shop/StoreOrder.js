import request from '@/utils/request'

export function getOrder(params) {
  return request({
    url: '/shop/order',
    method: 'get',
    params
  })
}
export function getLogistics(data) {
  return request({
    url: '/shop/order/express',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: 'shop/order',
    method: 'put',
    data
  })
}
export default { getOrder, edit, getLogistics }
