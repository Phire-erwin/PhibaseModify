import axios from '@/axios.js'
import router from '@/router/index.js'
export default {
  fetchApplication: ({ commit }) => {
    return new Promise((resolve, reject) => {
      axios
        .get('/common/applications')
        .then(res => {
          commit('FETCH_APPLICATION', res.data.data)
          resolve()
        })
        .catch(err => reject(err))
    })
  },
  fetchCurrentApplication:({commit})=>{
    let appName=router.app.$session.get('phibase-app');
    return new Promise((resolve, reject) => {
      axios
        .get('/common/applications?name='+appName)
        .then(res => {
          commit('CURRENT_APPLICATION', res.data.data[0])
          resolve()
        })
        .catch(err => reject(err))
    })
  },
  updateCurrentApplication:({commit},payload)=>{
    return new Promise((resolve, reject) => {
      axios
        .put('/common/applications/'+payload.id,payload)
        .then(res => {
          commit('CURRENT_APPLICATION', res.data.data)
          resolve()
        })
        .catch(err => reject(err))
    })
  },
  getReqApplication:({commit})=>{
    return new Promise((resolve, reject) => {
      axios
        .get('/common/request-application')
        .then(res => {
          commit('GET_APPLICATION', res.data.data)
          resolve()
        })
        .catch(err => reject(err))
    })
  },
  addApplication:({commit}, payload)=>{
    return new Promise((resolve, reject) => {
      axios
        .post('/common/applications/'+payload.id, payload)
        .then(res => {
          commit('ADD_APPLICATION', res.data.data)
          resolve()
        })
        .catch(err => reject(err))
    })
  },
  rejectedReqApplication:({commit},payload)=>{
    new Promise((resolve, reject) => {
      axios
        .put('/common/rejected-application/'+payload.id, payload)
        .then(res => {
          commit('UPDATE_REQAPPLICATION', res.data)
          resolve()
        })
        .catch(err => reject(err))
    })
  },
  approvedReqApplication:({commit},payload)=>{
    return new Promise((resolve, reject) => {
      axios
        .put('/common/approved-application/'+payload.id, payload)
        .then(res => {
          commit('UPDATE_REQAPPLICATION', res.data)
          resolve()
        })
        .catch(err => reject(err))
    })
  },
}