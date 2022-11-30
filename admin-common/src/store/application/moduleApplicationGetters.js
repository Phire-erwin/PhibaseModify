import state from "../state"

export default {
  getApplication: state =>  {
    return state.application
  },
  getCurrentApplication:state=>{
    return state.curApplication
  },
  getReqApplication: state => {
    return state.reqApplication
  },
  addApplication: state => {
    return state.addApplication
  },
  deleteReqApplication: state => {
    return state.reqApplication
  }
}