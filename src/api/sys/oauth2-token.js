import request from '@/utils/request'

export default {
  clientTokenPageList(params) {
    return request({
      url: '/uaa/oauth2-token/page',
      method: 'get',
      params
    })
  },

  removeToken(token) {
    return request({
      url: `/uaa/oauth2-token/remove/${token}`,
      method: 'delete'
    })
  }
}