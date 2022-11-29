import axios from '@/axios.js'
import router from '@/router/index.js'
export default {
  fetchApplication: ({ commit }) => {
    new Promise((resolve, reject) => {
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
    new Promise((resolve, reject) => {
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
    new Promise((resolve, reject) => {
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
        new Promise((resolve, reject) => {
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
        new Promise((resolve, reject) => {
            axios
                .post('/common/applications/'+payload.id,payload)
                .then(res => {
                    commit('FETCH_APPLICATION', res.data)
                    resolve()
                })
                .catch(err => reject(err))
        })
    },
    deleteReqApplication: ({ commit },{ id }) => {
        return new Promise((resolve, reject) => {
            axios
                .delete('/common/request-applications/' + id)
                .then(() => {
                    commit('DELETE_REQAPPLICATION', id)
                    resolve()
                })
                .catch(err => reject(err))
        })
    }
}