import Vue from 'vue';
import App from './App.vue';
import zebraView from './packages';

Vue.use(zebraView);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
