import reuqest from '@/utils/request'

export default {
  /**
   * 获取岗位列表
   * @returns 岗位列表
   */
  postList() {
    return reuqest({
      url: '/admin/post/list',
      method: 'get'
    })
  },

  postPageList(params) {
    return reuqest({
      url: '/admin/post/page',
      method: 'get',
      params
    })
  },

  addPost(data) {
    return reuqest({
      url: '/admin/post/add',
      method: 'post',
      data
    })
  },

  updatePost(data) {
    return reuqest({
      url: '/admin/post/update',
      method: 'put',
      data
    })
  },

  getPostInfo(postId) {
    return reuqest({
      url: `/admin/post/info/${postId}`,
      method: 'get'
    })
  },

  removePost(postId) {
    return reuqest({
      url: `/admin/post/remove/${postId}`,
      method: 'delete'
    })
  }
}