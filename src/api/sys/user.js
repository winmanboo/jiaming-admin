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
  }
}

