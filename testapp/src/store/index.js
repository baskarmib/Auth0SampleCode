import { createStore } from "vuex";

export default createStore({
  state: {
    isauthenticated : false,
    user:null
  },
  mutations: {
    updateauthenticated(state,value)
    {
      console.log("Store method called");
      state.isauthenticated = value;
    },
    updateuser(state,value)
    {
      console.log("Update user in store");      
      state.user = value;
    }
  },
  actions: {},
  modules: {},
});