import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import leafletCss from 'leaflet/dist/leaflet.css'
import VuetifyDialog from 'vuetify-dialog'
import 'vuetify-dialog/dist/vuetify-dialog.css'
import VueIntro from 'vue-introjs';
Vue.use(VueIntro);
import 'intro.js/introjs.css'
import 'intro.js/themes/introjs-flattener.css';

Vue.config.productionTip = false
Vue.use(VuetifyDialog, {
  context: {
    vuetify,
  },
})
new Vue({
  router,
  store,
  vuetify,
  leafletCss,
  render: h => h(App)
}).$mount('#app')
