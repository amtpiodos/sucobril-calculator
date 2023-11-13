import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/index.css'

import HeroIcon from 'vue-heroicons'
import { clipboard } from 'vue-heroicons/src/icons'

Vue.config.productionTip = false

HeroIcon.add([clipboard])
Vue.use(HeroIcon)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
