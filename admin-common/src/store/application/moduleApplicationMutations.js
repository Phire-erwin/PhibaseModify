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