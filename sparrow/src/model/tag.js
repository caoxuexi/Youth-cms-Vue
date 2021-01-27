/**
 * @author 曹学习
 * @description tag
 * @date 2021/1/26 22:50
 */
import { post, get, put, _delete } from '@/lin/plugin/axios'

class Tag {
  static async addTag(data) {
    const res = await post('v1/tag', data)
    return res
  }

  static async getTag(id) {
    const res = await get(`v1/tag/${id}`)
    return res
  }

  static async editTag(id, data) {
    const res = await put(`v1/tag/${id}`, data)
    return res
  }

  static async deleteTag(id) {
    const res = await _delete(`v1/tag/${id}`)
    return res
  }

  static async getTags(page = 0, count = 10) {
    const res = await get('v1/tag/page', {
      page,
      count,
    })
    return res
  }
}

export default Tag
