/* eslint-disable arrow-parens */
/* eslint-disable semi */
import Vue from 'vue';
import { BootstrapVue, IconsPlugin, ModalPlugin } from 'bootstrap-vue';
import VueCompositionAPI from '@vue/composition-api';

import router from './router';
import store from './store';
import App from './App.vue';

// Global Components
import './global-components';

// 3rd party plugins
import '@/libs/portal-vue';

import vSelect from "vue-select";
Vue.component("v-select", vSelect);
import "vue-select/dist/vue-select.css";


import Vuelidate from 'vuelidate';
Vue.use(Vuelidate);

Vue.use(BootstrapVue)

Vue.use(IconsPlugin)

// BSV Plugin Registration
Vue.use(ModalPlugin);

// Composition API
Vue.use(VueCompositionAPI);

// import core styles
require('@core/scss/core.scss');

// import assets styles
require('@/assets/scss/style.scss');

Vue.config.productionTip = false;

// Vue Session
import VueSession from 'vue-session'
Vue.use(VueSession, {
  persist: true
})

// Vue JSON Excel
import JsonExcel from 'vue-json-excel'
Vue.component('downloadExcel', JsonExcel)

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
