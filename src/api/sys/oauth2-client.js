import request from '@/utils/request'

export default {
  clientPageList(params) {
    return request({
      url: '/uaa/client/page',
      method: 'get',
      params
    })
  },

  getClientInfo(id) {
    return request({
      url: `/uaa/client/info/${id}`,
      method: 'get'
    })
  },

  registerClient(data) {
    return request({
      url: '/uaa/client/register',
      method: 'post',
      data
    })
  },
  
  updateClient(data) {
    return request({
      url: '/uaa/client/update', 
      method: 'put',
      data
    })
  }
}