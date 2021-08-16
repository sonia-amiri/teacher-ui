import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './css/global.css'

import axios from 'axios'

axios.defaults.baseURL = ''
axios.defaults.headers.post['Content-Type'] = 'application/json'
Vue.prototype.$axios = axios

Vue.config.productionTip = false
axios.interceptors.response.use(
  response => {
    // 拦截响应，做统一处理
    if (response.data.code) {
      const error = new Error(response.data.msg)
      error.code = response.data.code
      console.log(response.data)
      return Promise.reject(error)
    }
    return response.data
  },
  // 接口错误状态处理，也就是说无响应时的处理
  error => {
    console.log(error)
    return Promise.reject(error.response.status) // 返回接口返回的错误信息
  })

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
