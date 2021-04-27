import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    
  state: {
    buyers: [{
        id: 1,
        lastname: 'Piodos',
        firstname: 'Ana Marie',
        middlename: 'Tanudtanud',
        birthdate: 'July 24, 1997'
      },
      {
        id: 2,
        lastname: 'Posy',
        firstname: 'Beatrice',
        middlename: 'May',
        birthdate: 'July 16, 1963'
      },
      {
        id: 3,
        lastname: 'Swift',
        firstname: 'Taylor',
        middlename: 'Allison',
        birthdate: 'December 13, 1989'
      }
    ],
    buyerData: {}
  },
  mutations: {
    GET_BUYER(state, payload) {
      state.buyerData = payload
    }
  },
  actions: {
    showBuyer: (context, param) => {
      let data = context.getters.singleBuyer(param);
      context.commit('GET_BUYER', data);
    }
  },
  modules: {
  },
  getters: {
    buyers: state => {
      return state.buyers
    },
    singleBuyer: state => buyerId => {
      return state.buyers.find(buyer => buyer.id == buyerId)
    }
  }
})
