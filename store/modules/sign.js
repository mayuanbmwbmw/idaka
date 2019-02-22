// import axios from 'axios'
// import { Toast } from 'vant'

export const state = () => ({
  signlist: null,
  isPc: null
})

export const mutations = {
  SET_SIGN_LIST: function (state, signlist) {
    state.signlist = signlist
  },
  SET_PC: function (state, isPc) {
    console.info(321, isPc)
    state.isPc = isPc
  }
}

export const actions = {
  setSignList ({ commit }, signlist) {
    // console.info('token', token)
    commit('SET_SIGN_LIST', signlist)
  },
  setPc ({ commit }, isPc) {
    // console.info('token', token)
    commit('SET_PC', isPc)
  }
}

export default {
  actions,
  state,
  // getters
  // actions,
  mutations
}
