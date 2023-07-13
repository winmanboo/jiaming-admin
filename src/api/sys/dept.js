import request from '@/utils/request'

export default {
  /**
   * 获取部门树形列表
   * @returns 部门树形列表
   */
  deptTree() {
    return request({
      url: '/admin/dept/list',
      method: 'get'
    })
  }
}


