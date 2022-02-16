// These need to come first, for CSS precedence.
import initSimpledotcss from "@/init/initSimpledotcss";
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

initSimpledotcss();
initDarkMode(usePreferencesStore);

app.mount("#app");


// import initSimpledotcss from "@/init/initSimpledotcss";
// import initDarkMode from "@/init/initDarkMode";
// import { defineComponent } from "vue";
// import App from "@/App.vue";
// import "@/registerServiceWorker";
// import router from "@/router";
// import store from "@/store";

// initSimpledotcss();
// initDarkMode(store);

// Vue.config.productionTip = false;

// new Vue({
//   router,
//   store,
//   render: h => h(App),
// }).$mount("#app");
