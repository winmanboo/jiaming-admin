import request from '@/utils/request'

export default {
  routes(params) {
    return request({
      url: '/admin/menu/route',
      method: 'get',
      params
    })
  },

  getMenuInfo(menuId) {
    return request({
      url: `/admin/menu/info/${menuId}`,
      method: 'get'
    })
  },

  addMenu(data) {
    return request({
      url: '/admin/menu/add',
      method: 'post',
      data
    })
  },

  updateMenu(data) {
    return request({
      url: '/admin/menu/update',
      method: 'put',
      data
    })
  },

  removeMenu(menuId) {
    return request({
      url: `/admin/menu/remove/${menuId}`,
      method: 'delete'
    })
  },

  assignMenuIdList(roleId) {
    return request({
      url: `/admin/menu/assign_list/${roleId}`,
      method: 'get'
    })
  },

  assignMenu(data) {
    return request({
      url: '/admin/menu/assign_menu',
      method: 'post',
      data
    })
  }
}