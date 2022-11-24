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
}