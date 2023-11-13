import Vue from 'vue'
import Vuex from 'vuex'
import VuexReset from '@ianwalter/vuex-reset'
import buyer from '../store/modules/buyer'
import unit from '../store/modules/unit'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [VuexReset()],
  modules: {
    buyer,
    unit
  }
})