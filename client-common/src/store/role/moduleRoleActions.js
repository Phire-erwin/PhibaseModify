import axios from '@/axios.js'
import router from '@/router/index.js'

export default {
  fetchRole: ({ commit }) => {
    return new Promise((resolve, reject) => {
      axios
        .get('/common/roles')
        .then(res => {
          var filteredRoles = res.data.filter(doc => {
            return doc.app === router.app.$session.get('phibase-app');
          })
          commit('FETCH_ROLE', filteredRoles)
          resolve()
        })
        .catch(err => reject(err))
    })
  },
  addRole: ({commit}, payload) => {
    return new Promise((resolve, reject) => {
      axios
        .post('/common/roles', payload)
        .then(res => {
          commit('ADD_ROLE', res.data)
          resolve()
        })
        .catch(err => reject(err))
    })
  },
  updateRole: ({ commit }, { id, data }) => {
    return new Promise((resolve, reject) => {
      axios
        .put('/common/roles/' + id, data)
        .then(res => {
          commit('UPDATE_ROLE', res.data)
          resolve()
        })
        .catch(err => reject(err))
    })
  },
  deleteRole: ({ commit }, { id }) => {
    return new Promise((resolve, reject) => {
      axios
        .delete('/common/roles/' + id)
        .then(() => {
          commit('DELETE_ROLE', id)
          resolve()
        })
        .catch(err => reject(err))
    })
  }
}