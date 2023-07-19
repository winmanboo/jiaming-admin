import request from '@/utils/request'

export default {
  clientPageList(params) {
    return request({
      url: '/uaa/oauth2-client/page',
      method: 'get',
      params
    })
  },

  getClientInfo(id) {
    return request({
      url: `/uaa/oauth2-client/info/${id}`,
      method: 'get'
    })
  },

  registerClient(data) {
    return request({
      url: '/uaa/oauth2-client/register',
      method: 'post',
      data
    })
  },
  
  updateClient(data) {
    return request({
      url: '/uaa/oauth2-client/update', 
      method: 'put',
      data
    })
  }
}