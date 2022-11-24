import axios from '@/axios.js'
import router from '@/router/index.js'

export default {
  fetchItem: ({ commit }) => {
    return new Promise((resolve, reject) => {
      axios
        .get('/common/items')
        .then(res => {
          var filteredItems = res.data.data.filter(doc => {
            return doc.app === router.app.$session.get('phibase-app');
          })
          commit('FETCH_ITEM', filteredItems)
          resolve()
        })
        .catch(err => reject(err))
    })
  },
  addItem: ({commit}, payload) => {
    return new Promise((resolve, reject) => {
      axios
        .post('/common/items', payload)
        .then(res => {
          commit('ADD_ITEM', res.data.data)
          resolve()
        })
        .catch(err => reject(err))
    })
  },
  updateItem: ({ commit }, { id, data }) => {
    return new Promise((resolve, reject) => {
      axios
        .put('/common/items/' + id, data)
        .then(res => {
          commit('UPDATE_ITEM', res.data.data)
          resolve()
        })
        .catch(err => reject(err))
    })
  },
  deleteItem: ({ commit }, { id }) => {
    return new Promise((resolve, reject) => {
      axios
        .delete('/common/items/' + id)
        .then(() => {
          commit('DELETE_ITEM', id)
          resolve()
        })
        .catch(err => reject(err))
    })
  }
}