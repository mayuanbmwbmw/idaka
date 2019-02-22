// import axios from '~/plugins/axios'
// import qs from 'querystring'

// const baseUrl = process.env.SERVER
// const baseUrl = 'localhost'

const state = {
  path: null,
  t: null
}

// getters
const getters = {
  loadPath: (state, getters, rootState) => {
    return state.path
  },
  loadToken: (state, getters, rootState) => {
    return state.t
  }
}

// actions
const actions = {
  checkout ({ commit, state }, mobile) {
    console.log('mobile', mobile)
    state.path = null
  }
}

// mutations
// const mutations = {
//   consoleInfo (state, data) {
//     console.info('id', data)
//     // console.info('added', state.added)
//   }
// }

export default {
  actions,
  state,
  getters
  // actions,
  // mutations
}
