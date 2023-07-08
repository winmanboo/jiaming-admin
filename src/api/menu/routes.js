import request from '@/utils/request'

export function routes() {
  return request({
    url: '/admin/menu/route',
    method: 'get'
  })
}