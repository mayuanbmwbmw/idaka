// import axios from 'axios'
// import { Toast } from 'vant'

export const state = () => ({
  userInfo: null
})

export const mutations = {
  SET_USER: function (state, userInfo) {
    state.userInfo = userInfo
  },
  DELETE_USER: function (state, userInfo) {
    state.userInfo = null
  }
}

export const actions = {
  // nuxtServerInit is called by Nuxt.js before server-rendering every page
  nuxtServerInit ({ commit }, { req }) {
    if (req.session && req.session.userInfo) {
      commit('SET_USER', req.session.userInfo)
    } else {
      commit('SET_USER', null)
    }
  },

  async logout ({ commit }) {
    commit('DELETE_USER')
    // console.info('DELETE_USER')
  },
  setUser ({ commit }, userInfo) {
    // console.info('token', token)
    commit('SET_USER', userInfo)
  }
}

export default {
  actions,
  state,
  // getters
  // actions,
  mutations
}
