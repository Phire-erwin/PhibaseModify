import axios from '@/axios'
import router from '@/router/index.js'

export default {
  fetchRoleCounter: ({ commit }) => {
    return axios
    .get('/common/users-count-role/' + router.app.$session.get('phibase-app'))
    .then(res => {
      commit('GET_ROLE_COUNTER', res.data);
      return res.data
      
    })
    
    .catch(err => {
      alert(err);
    });
  },

  fetchUserByDate: ({ commit }) => {
    return axios
    .get('/common/users-by-date/' + router.app.$session.get('phibase-app'))
    .then(res => {
      commit('GET_USER_BY_DATE', res.data);
      return res.data
      
    })

    .catch(err => {
      alert(err);
    });
  },
  
   
}
