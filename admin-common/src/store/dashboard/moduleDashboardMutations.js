export default {
  GET_ROLE_COUNTER: (state, payload) => {
    state.roleCounter = payload  
  },

  GET_USER_BY_DATE: (state, payload) => {
    state.userByDate = payload
  },

}
