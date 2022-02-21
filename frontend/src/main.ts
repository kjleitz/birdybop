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

console.log("Birdybop is open source! Contributors are welcome. Check out the repo on GitHub: https://github.com/kjleitz/birdybop"); // eslint-disable-line

const app = createApp(App);

app.use(createPinia());
app.use(router);

initDarkMode(usePreferencesStore);

app.mount("#app");
