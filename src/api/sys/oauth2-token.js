import request from '@/utils/request'

export default {
  clientTokenPageList(params) {
    return request({
      url: '/uaa/oauth2-token/page',
      method: 'get',
      params
    })
  },

  removeToken(authorizationId) {
    return request({
      url: `/uaa/oauth2-token/remove/${authorizationId}`,
      method: 'delete'
    })
  }
}