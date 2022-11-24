import axios from '@/axios.js'
import router from '@/router/index.js'

export default {
  register: ({ commit }, payload) => {
    return new Promise((resolve, reject) => {
      axios
        .post('common/auth/register', payload)
        .then(res => {
          commit('AUTH_USER', res.data.token);
          resolve()
        })
        .catch(error => {
          console.log(error)
          reject(error)
        });
    })
  },

  login: ({ commit }, payload) => {
    return new Promise((resolve, reject) => {
      axios
        .post('common/auth/login', payload)
        .then(res => {
          var result = res.data.existingUser;
          
          router.app.$session.start();
          router.app.$session.set('phibase-permission', JSON.stringify(result.roleRef.permission));
          router.app.$session.set('phibase-id', result.id);
          router.app.$session.set('phibase-app', result.props.app);

          commit('AUTH_USER', res.data.token);
          commit('USER_ID', result.id);

          // update axios authentication token
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.token
          resolve()
        })
        .catch(error => {
          console.log(error)
          reject(error)
        });
    })
  },

  fetchUser: ({ commit }) => {
    var userID = router.app.$session.get('phibase-id');
    if (userID) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/common/user-by-id/${userID}`)
          .then(res => {
            commit('USER_DETAIL', res.data);
            resolve()
          })
          .catch(error => reject(error));
      })
    }
  },

  updateUser: ({ commit }, data) => {
    var userID = router.app.$session.get('phibase-id');
    if (userID) {
      return new Promise((resolve, reject) => {
        axios
          .put(`/common/users/${userID}`, data)
          .then(res => {
            res.data.roleRef = data.roleRef;
            commit('UPDATE_USER', res.data)
            resolve()
          })
          .catch(err => reject(err))
      })
    }
  },

  generate2FA: ({ commit }) => {
    var userID = router.app.$session.get('phibase-id');
    if (userID) {
      return new Promise((resolve, reject) => {
        axios
          .post(`/common/generate/2fa/${userID}`)
          .then(res => {
            //res.data.roleRef = data.roleRef;
            commit('UPDATE_USER', res.data.newUserData)
            resolve(res)
          })
          .catch(err => reject(err))
      })
    }
  },
  validate2FA: ({ commit }, data) => {
    var userID = router.app.$session.get('phibase-id');
    if (userID) {
      return new Promise((resolve, reject) => {
        axios
          .post(`/common/validate/2fa/${userID}`,{code2fa:data})
          .then(res => {
            resolve(res)
          })
          .catch(err => reject(err))
      })
    }
  }
}