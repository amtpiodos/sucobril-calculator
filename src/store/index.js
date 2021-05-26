import Vue from 'vue'
import Vuex from 'vuex'
import VuexReset from '@ianwalter/vuex-reset'
import buyer_info from '../store/modules/buyer'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [VuexReset()],
  modules: {
    buyer_info
  }
})