import Vue from 'vue'

export const errorTip = function (error) {
  console.log(error)
  Vue.prototype.$message.error(error.message)
}
export const successTip = function (msg) {
  Vue.prototype.$message.success(msg || '操作成功')
}
export default {
  errorTip, successTip
}
