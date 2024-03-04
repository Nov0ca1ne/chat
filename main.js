import App from './App'
import uView from '@/uni_modules/uview-ui'
// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
import store from './store/index.js'
Vue.config.productionTip = false
Vue.prototype.$store = store
App.mpType = 'app'
const app = new Vue({
  ...App,
  store
})
Vue.use(uView)

app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif