export default {
  FETCH_APPLICATION: (state, payload) => {
    state.application = payload
  },
  CURRENT_APPLICATION:(state,payload)=>{
    state.curApplication=payload;
  },
  UPDATE_APPLICATION: (state, payload) => {
    state.curApplication = payload
  },
  UPDATE_REQAPPLICATION: (state, payload) => {
    let user = state.reqApplication.find(u => u.id === payload.id)
    for (let [key, value] of Object.entries(payload)) {
      if (user[key] && user[key] !== value) {
        user[key] = value
      }
    }
  },
  GET_APPLICATION: (state, payload) => {
    state.reqApplication = payload
  },
  ADD_APPLICATION: (state, payload) => {
    state.addApplication.push(payload)
  },
  DELETE_REQAPPLICATION: (state, payload) => {
    let i = state.reqApplication.findIndex(u => u.id === payload)
    state.reqApplication.splice(i, 1)
  }
}