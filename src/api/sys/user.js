import request from '@/utils/request'

export default {
  /**
   * 用户分页信息
   * @param {分页参数} params 
   * @returns 用户分页信息
   */
  userPageList(params) {
    return request({
      url: '/admin/user/page',
      method: 'get',
      params
    })
  },

  /**
   * 改变用户状态
   * @param {*} data 用户 id 和用户状态
   * @returns 
   */
  changeUserStatus(data) {
    return request({
      url: '/admin/user/status',
      method: 'post',
      data
    })
  },

  addUser(data) {
    return request({
      url: '/admin/user/add',
      method: 'post',
      data
    })
  },

  updateUser(data) {
    return request({
      url: '/admin/user/update',
      method: 'put',
      data
    })
  },

  getUserInfo(userId) {
    return request({
      url: `/admin/user/userinfo/${userId}`,
      method: 'get'
    })
  },

  deleteUser(userId) {
    return request({
      url: `/admin/user/remove/${userId}`,
      method: 'delete'
    })
  },

  resetPassword(data) {
    return request({
      url: '/admin/user/reset',
      method: 'put',
      data
    })
  }
}

