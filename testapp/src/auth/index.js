import  { createApp } from "vue";
import createAuth0Client from "@auth0/auth0-spa-js";
import { inject } from 'vue';

/** Define a default action to perform after authentication */
const DEFAULT_REDIRECT_CALLBACK = () =>
{
  window.history.replaceState({}, document.title, window.location.pathname);
  instance._component.methods.handleRedirectCallback().then(function(){
     console.log("callback performed");
  });
}
  

let instance;

/** Returns the current instance of the SDK */
export const getInstance = () => instance;

export const envAuth = Symbol();


/** Creates an instance of the Auth0 SDK. If one has already been created, it returns that instance */
export const useAuth0 = ({
  onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
  redirectUri = window.location.origin,
  ...options
}) => {
  if (instance) return instance;

  // The 'instance' is simply a Vue object
  instance = createApp({
    data() {      
      return {
        loading: true,
        isAuthenticated: false,
        user: {},
        auth0Client: null,
        popupOpen: false,
        error: null
      };
    },
    methods: {
      /** Authenticates the user using a popup window */
      async loginWithPopup(options, config) {
        this.popupOpen = true;

        try {
          await this.auth0Client.loginWithPopup(options, config);
          this.user = await this.auth0Client.getUser();
          this.isAuthenticated = await this.auth0Client.isAuthenticated();
          this.error = null;
        } catch (e) {
          this.error = e;
          // eslint-disable-next-line
          console.error(e);
        } finally {
          this.popupOpen = false;
        }

        this.user = await this.auth0Client.getUser();
        this.isAuthenticated = true;
      },
      /** Handles the callback when logging in using a redirect */
      async handleRedirectCallback() {
       
        this.loading = true;
        try {
          console.log("here");
          await instance._component.auth0Client.handleRedirectCallback();
          this.user = await instance._component.auth0Client.getUser();
          this.isAuthenticated = true;
          if(sessionStorage)
          {
            sessionStorage.tokenDetails = await instance._component.auth0Client.getTokenSilently();
          }         
          this.error = null;
        } catch (e) {
          this.error = e;
        } finally {
          this.loading = false;
        }
      },
      /** Authenticates the user using the redirect method */
      loginWithRedirect(client,o) {        
        return client.loginWithRedirect(o);
      },
      /** Returns all the claims present in the ID token */
      getIdTokenClaims(o) {
        return this.auth0Client.getIdTokenClaims(o);
      },
      /** Returns the access token. If the token is invalid or missing, a new one is retrieved */
      getTokenSilently(o) {
        return instance._component.auth0Client.getTokenSilently(o);
      },
      /** Gets the access token using a popup window */

      getTokenWithPopup(o) {
        return this.auth0Client.getTokenWithPopup(o);
      },
      /** Logs the user out and removes their session on the authorization server */
      logout(o) {
        if(sessionStorage)
        {
         sessionStorage.clear();
        }
        return instance._component.auth0Client.logout(o);
      }
    },
    /** Use this lifecycle method to instantiate the SDK client */
    async created() {
      try {
         // Create a new instance of the SDK client using members of the given options object
        if(!instance._component.auth0Client)
      {
        this.auth0Client = await createAuth0Client({
          ...options,
          client_id: options.clientId,
          redirect_uri: redirectUri
        });
      }      
      
        // If the user is returning to the app after authentication..
        if (
          window.location.search.includes("code=") &&
          window.location.search.includes("state=")
        ) {
          // handle the redirect and retrieve tokens     
          console.log("Authenticate Redirected");     
          this.appState  = await instance._component.methods.handleRedirectCallback();
          
          this.error = null;

          // Notify subscribers that the redirect callback has happened, passing the appState
          // (useful for retrieving any pre-authentication state)
          onRedirectCallback(this.appState);
        }
      } catch (e) {
        this.error = e;
      } finally {
        // Initialize our internal authentication state
        this.isAuthenticated = await instance._component.auth0Client.isAuthenticated();
        this.user = await instance._component.auth0Client.getUser();
        this.loading = false;
      }
    }
  });

  return instance;
};

// Create a simple Vue plugin to expose the wrapper object throughout the application
export default{  
 
  install :(app, options) => {
   const authFunctions = useAuth0(options);
   app.config.globalProperties.$auth = authFunctions;

   app.provide(envAuth,authFunctions);
   
   app.provide('authMethods',authFunctions);
  

   const login = ()=>{
     if(authFunctions._component.auth0Client)
     {
      app.provide('authClient',authFunctions._component.auth0Client);
      authFunctions._component.methods.loginWithRedirect(authFunctions._component.auth0Client);
     }
   };

   const logout = ()=>{
    var logoutparameters = {
      returnTo: window.location.origin
    };
    authFunctions._component.methods.logout(logoutparameters);
   };
   
   app.provide('loginRedirect',login);

   app.provide('logout',logout );
  }
};

export function useAuth() {  
  const authenv = inject(envAuth);  
  if (!authenv) throw new Error('No env provided!');
  return authenv;
}