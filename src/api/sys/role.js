import request from '@/utils/request'

export default {
  fetchRolePageList(params) {
    return request({
      url: '/admin/role/page',
      method: 'get',
      params
    })
  },

  fetchRoleInfo(roleId) {
    return request({
      url: `/admin/role/info/${roleId}`,
      method: 'get'
    })
  },

  addRole(data) {
    return request({
      url: '/admin/role/add',
      method: 'post',
      data
    })
  },

  updateRole(data) {
    return request({
      url: '/admin/role/update',
      method: 'put',
      data
    })
  },

  removeRole(roleId) {
    return request({
      url: `/admin/role/remove/${roleId}`,
      method: 'delete'
    })
  },

  fetchRoleList() {
    return request({
      url: '/admin/role/list', 
      method: 'get'
    })
  },

  assign(data) {
    return request({
      url: '/admin/role/assign',
      method: 'post',
      data
    })
  }
}