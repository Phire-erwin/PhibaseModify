import state from './moduleApplicationState.js'
import mutations from './moduleApplicationMutations.js'
import actions from './moduleApplicationActions.js'
import getters from './moduleApplicationGetters.js'

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}