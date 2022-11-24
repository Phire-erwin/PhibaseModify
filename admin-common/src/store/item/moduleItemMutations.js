export default {
  FETCH_ITEM: (state, payload) => {
    state.item = payload
  },
  ADD_ITEM: (state, payload) => {
    state.item.push(payload)
  },
  UPDATE_ITEM: (state, payload) => {
    let item = state.item.find(u => u.id === payload.id)
    for (let [key, value] of Object.entries(payload)) {
      if (item[key] && item[key] !== value) {
        item[key] = value
      }
    }
  },
  DELETE_ITEM: (state, payload) => {
    let i = state.item.findIndex(u => u.id === payload)
    state.item.splice(i, 1)
  }
}