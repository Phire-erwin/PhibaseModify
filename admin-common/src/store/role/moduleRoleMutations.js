export default {
  FETCH_ROLE: (state, payload) => {
    state.role = payload
  },
  ADD_ROLE: (state, payload) => {
    state.role.push(payload)
  },
  UPDATE_ROLE: (state, payload) => {
    let role = state.role.find(u => u.id === payload.id)
    for (let [key, value] of Object.entries(payload)) {
      if (role[key] && role[key] !== value) {
        role[key] = value
      }
    }
  },
  DELETE_ROLE: (state, payload) => {
    let i = state.role.findIndex(u => u.id === payload)
    state.role.splice(i, 1)
  }
}