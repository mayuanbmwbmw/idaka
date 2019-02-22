import Vue from 'vue'
import Vuex from 'vuex'
import login from './modules/login'
import sign from './modules/sign'
import getters from './getters'

Vue.use(Vuex)

const store = () => new Vuex.Store({
  modules: {
    login,
    sign
  },
  getters
})

export default store
