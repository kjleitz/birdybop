// import initBootstrap from '@/init/initBootstrap';
import initSimpledotcss from '@/init/initSimpledotcss';
import Vue from 'vue';
import App from '@/App.vue';
import '@/registerServiceWorker';
import router from '@/router';
import store from '@/store';

// initBootstrap();
initSimpledotcss();

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
