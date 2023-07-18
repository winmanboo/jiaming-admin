import request from '@/utils/request'

export default {
  /**
   * 获取部门树形列表
   * @returns 部门树形列表
   */
  deptTree(params) {
    return request({
      url: '/admin/dept/list',
      method: 'get',
      params
    })
  },

  deptInfo(deptId) {
    return request({
      url: `/admin/dept/info/${deptId}`,
      method: 'get'
    })
  },

  addDept(data) {
    return request({
      url: '/admin/dept/add', 
      method: 'post', 
      data
    })
  },

  updateDept(data) {
    return request({
      url: '/admin/dept/update',
      method: 'put',
      data
    })
  }
}


