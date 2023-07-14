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
  }
}