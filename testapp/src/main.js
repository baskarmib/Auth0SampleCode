import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// Import the Auth0 configuration
import { domain, clientId, audience } from "../auth_config.json";
// Import the plugin here
import Auth0Plugin from "./auth/index";

createApp(App).use(store).use(router).use(Auth0Plugin, {
  domain,
  clientId,
  audience,
  onRedirectCallback: appState => {
    router.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname
    );
  }
}).mount("#app");
