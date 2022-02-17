// These need to come first, for CSS precedence.
import "@/styles/main.scss";
import initDarkMode from "@/init/initDarkMode";

// ...and now we can import the others.
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "@/App.vue";
import router from "@/router";
import { usePreferencesStore } from "@/stores/preferences";
// import "@/registerServiceWorker";

const app = createApp(App);

app.use(createPinia());
app.use(router);

initDarkMode(usePreferencesStore);

app.mount("#app");
