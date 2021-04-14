/*
 * @Description:
 * @Author: 梦萦几度
 * @Date: 2021-03-28 10:44:57
 * @LastEditors: 梦萦几度
 * @LastEditTime: 2021-03-28 14:16:25
 */
export default {
  suc: (obj = {}) => {
    return {
      data: {
        code: obj.code || '0000',
        msg: obj.msg || '成功',
        data: obj.data || {}
      }
    }
  },
  err: (obj = {}) => {
    return {
      data: {
        code: obj.code || '0001',
        msg: obj.msg || '失败',
        data: obj.data || {}
      }
    }
  },
}
