<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Pizza42 Factory" />

    <div v-if="loading">
      <!-- show login when not authenticated -->
      <button v-if="!isAuthenticated" @click="login">Log in</button>
      <!-- show logout when authenticated -->
      <button v-if="isAuthenticated" @click="logout">Log out</button>
    </div>
    <div v-if="isAuthenticated">
      <div>
      <img :src="picture">
      <h2>{{ name }}</h2>
      <p>{{ email }}</p>
    </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import {onMounted, computed} from "vue";
import { inject } from 'vue';
import {useStore} from 'vuex';
export default {
  name: "Home", 
  components: {
    HelloWorld,
  },   
 setup()
 {
   var loading = true;
   var isAuthenticated = false;
   var login = inject('loginRedirect');
   var logout = inject('logout');   
   const store = useStore();

    onMounted(() => {
      const authtest = inject('authMethods');

       loading = true;
       isAuthenticated = false;     
      console.log(loading);
      console.log(isAuthenticated);
     login = inject('loginRedirect');

     authtest._component.created().then(function()
     {
       console.log("auth client created");
       if (
          window.location.search.includes("code=") &&
          window.location.search.includes("state=")
        ) 
        {
          console.log("redirected");
          store.commit('updateauthenticated',authtest._component.isAuthenticated);
          store.commit('updateuser',authtest._component.user);         
          console.log(store.state.isauthenticated);
          isAuthenticated = store.state.isauthenticated;
          if(sessionStorage)
          {
            sessionStorage.isauthenticated = isAuthenticated; 
            sessionStorage.user =  authtest._component.user.sub; 
            sessionStorage.emailverified = authtest._component.user.email_verified;         
          }
        }
        else
        {
          console.log(store.state.isauthenticated);
        }
     });

     if(!window.location.search.includes("code=") &&
          !window.location.search.includes("state="))
          {
            console.log(store.state.isauthenticated);
          }
     
     
    
    
     logout = inject('logout');

     return{loading :computed(() => true), isAuthenticated:computed(() => store.state.isauthenticated),login,logout, name:computed(() => store.state.user.name), email:computed(() => store.state.user.email)};
   
    });

   return{loading :computed(() => true), isAuthenticated:computed(() => store.state.isauthenticated),login, logout, name:computed(() => store.state.user.name), email:computed(() => store.state.user.email)};
 }
};
</script>
