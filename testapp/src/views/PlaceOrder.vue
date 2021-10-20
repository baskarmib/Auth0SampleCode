<template>
  <div id="placeorder">
    <button @click="callApi">Validate Token</button>
    <p>{{ apiMessage }}</p>
    <p>{{ apiMessage1 }}</p>
  </div>
</template>

<script>
import axios from "axios";
import {onMounted} from "vue";
import router from '@/router';
import { useRoute } from 'vue-router'


export default {
  name: "placeorder",  
  data()
  {
    return {apiMessage : "Token Not Validated"};
  },
  setup()
  {
     
     var token = null;
     var isauthenticated = false;
     var apiMessage1 = "";
     
     if(sessionStorage)
     {
       isauthenticated = sessionStorage.isauthenticated;
     }
     console.log("placeorder");
     console.log(isauthenticated);
     onMounted(() => {           
           
           isauthenticated = sessionStorage.isauthenticated;
           if(sessionStorage)
           {
               token = sessionStorage.tokenDetails;
           }
           if((!token) || (!isauthenticated))
           {
              const route = useRoute();
                     console.log(route);
                     console.log(router);
                     router.push(router.getRoutes()[0]);
           }
           console.log("test");          
          
         
          
      });

        function callApi(){
          var token = sessionStorage.tokenDetails;
          // Use Axios to make a call to the API
          axios.get("/api/external", {
          headers: {
          Authorization: `Bearer ${token}`    // send the access token through the 'Authorization' header
          }
          }).then(function(data){ 
           apiMessage1 = "";           
           apiMessage1 = data.data.msg;                         
          });
       };

    return {callApi, apiMessage1};
  },
  
 
};
</script>