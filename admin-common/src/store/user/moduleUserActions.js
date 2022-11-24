import axios from '@/axios.js'
import router from '@/router/index.js'

export default {
  fetchUser: ({ commit }) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`/common/users/${router.app.$session.get('phibase-app')}`)
        .then(res => {
          commit('FETCH_USER', res.data)
          resolve()
        })
        .catch(err => reject(err))
    })
  },
  addUser: ({commit}, payload) => {
    return new Promise((resolve, reject) => {
      axios
        .post('/common/users', {
          ...payload,
          roleRef: {
            id: payload.roleRef.id,
            name: payload.roleRef.name
          }
        })
        .then(res => {
          res.data.roleRef = payload.roleRef;
          commit('ADD_USER', res.data)
          resolve()
        })
        .catch(err => reject(err))
    })
  },
  updateUser: ({ commit }, { id, data }) => {
    return new Promise((resolve, reject) => {
      axios
        .put('/common/users/' + id, {
          ...data,
          roleRef: {
            id: data.roleRef.id
          }
        })
        .then(res => {
          res.data.roleRef = data.roleRef;
          commit('UPDATE_USER', res.data)
          resolve()
        })
        .catch(err => reject(err))
    })
  },
  deleteUser: ({ commit }, { id }) => {
    return new Promise((resolve, reject) => {
      axios
        .delete('/common/users/' + id)
        .then(() => {
          commit('DELETE_USER', id)
          resolve()
        })
        .catch(err => reject(err))
    })
  }
}