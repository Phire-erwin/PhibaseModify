export default {
  FETCH_USER: (state, payload) => {
    state.user = payload
  },
  ADD_USER: (state, payload) => {
    state.user.push(payload)
  },
  UPDATE_USER: (state, payload) => {
    let user = state.user.find(u => u.id === payload.id)
    for (let [key, value] of Object.entries(payload)) {
      if (user[key] && user[key] !== value) {
        user[key] = value
      }
    }
  },
  DELETE_USER: (state, payload) => {
    let i = state.user.findIndex(u => u.id === payload)
    state.user.splice(i, 1)
  }
}