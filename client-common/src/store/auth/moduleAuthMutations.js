export default {
  AUTH_USER: (state, payload) => {
    state.token = payload;
  },

  USER_ID: (state, payload) => {
    state.userID = payload;
  },

  USER_DETAIL: (state, payload) => {
    state.activeUser = payload;
  },

  UPDATE_USER: (state, payload) => {
    let user = state.activeUser;
    for (let [key, value] of Object.entries(payload)) {
      if (user[key] && user[key] !== value) {
        user[key] = value
      }
    }
  },
}