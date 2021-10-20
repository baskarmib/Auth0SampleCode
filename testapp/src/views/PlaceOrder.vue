<template>
  <div id="placeorder">
    <button @click="callApi">Validate Token</button>
    <p>{{apiMessage}}</p>    
  </div>
  <div id="ordering" v-if="validated">
    <button @click="orderApi">PlaceOrder</button>
    <p>{{apiOrderMessage}}</p>  
  </div>
</template>

<script>
import axios from "axios";
import router from '@/router';
import { useRoute } from 'vue-router'
import {ref} from "vue";

export default {
  name: "placeorder", 
  setup()
  {
    const apiMessage = ref("Token Not Validated");
    const apiOrderMessage = ref("");
    const validated = ref(false);
    const callApi = () =>{
         var token = sessionStorage.tokenDetails;
          // Use Axios to make a call to the API
          axios.get("/api/external", {
          headers: {
          Authorization: `Bearer ${token}`    // send the access token through the 'Authorization' header
          }
          }).then(function(data){ 
           apiMessage.value = "";           
           apiMessage.value = data.data.msg; 
           if(data.data.msg.indexOf("successfully validated") > 0)
           {
             validated.value = true;
           }                                   
          });
    }

    const orderApi = () =>{
      var token = sessionStorage.tokenDetails;

      var orderDetails = { 
  'PizzaType': "Crust",
  'Topping': "Tomato, Onion, Bell Peppers, Green Pepper, Cheese",
  'Cheese': "Light Cheese"
};

       var headers = {
         headers:{
          Authorization: `Bearer ${token}`,// send the access token through the 'Authorization' header          
          EmailVerified: sessionStorage.emailverified,
          User: sessionStorage.user
          }};

          // Use Axios to make a call to the API
          axios.post("/api/order",orderDetails, headers).then(function(data){ 
           apiOrderMessage.value = "";           
           apiOrderMessage.value = data.data.msg; 
           if(data.data.msg == "Enable your email address")
           {
             apiOrderMessage.value = "Please confirm email before ordering";
           }                                   
          });
    }
    return {apiMessage, callApi,apiOrderMessage, validated, orderApi };
  },
  mounted()
  {
     
     var token = null;
     var isauthenticated = false;     
     
     if(sessionStorage)
     {
       isauthenticated = sessionStorage.isauthenticated;
     }
     console.log("placeorder");
     console.log(isauthenticated);
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
  },
  
 
};
</script>