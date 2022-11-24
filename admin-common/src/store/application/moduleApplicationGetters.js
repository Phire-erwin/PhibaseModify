import state from "../state"

export default {
  getApplication: state =>  {
    return state.application
  },
  getCurrentApplication:state=>{
    return state.curApplication
  }
}