import Vue from 'vue';

import VueRouter from 'vue-router';
import router from './routes.js';
Vue.use(VueRouter);

import i18n from './lang.js';

import store from './store/store.js';

import Buefy from 'buefy';
Vue.use(Buefy, {defaultIconPack: 'fas'});

import VeeValidate, {Validator} from 'vee-validate';
Validator.extend('positive', value => Number(value) > 0);
Vue.use(VeeValidate, {
  i18nRootKey: 'validations',
  i18n,
  inject: false
});

import Notifications from 'vue-notification';
Vue.use(Notifications);

import VTooltip from 'v-tooltip';
Vue.use(VTooltip);

import VueMoment from 'vue-moment';
const moment = require('moment');
Vue.use(VueMoment, {moment});

import VueShortKey from 'vue-shortkey';
Vue.use(VueShortKey, {
  prevent: [
    'input[type=text]',
    'input[type=password]',
    'input[type=search]',
    'input[type=email]',
    'textarea',
    '.ql-editor'
  ]
});

import * as vClickOutside from 'v-click-outside-x';
Vue.use(vClickOutside);

import VueLayers from 'vuelayers';
import ZoomifySource from './vuelayers-suppl/zoomify-source';
import RasterSource from './vuelayers-suppl/raster-source';
import TranslateInteraction from './vuelayers-suppl/translate-interaction';
import RotateInteraction from './vuelayers-suppl/rotate-interaction';
Vue.use(VueLayers);
Vue.use(ZoomifySource);
Vue.use(RasterSource);
Vue.use(TranslateInteraction);
Vue.use(RotateInteraction);

import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.plugins.unregister(ChartDataLabels);
Chart.helpers.merge(Chart.defaults.global.plugins.datalabels, {
  anchor: 'end',
  align: 'end',
  offset: 5,
  clamp: true
});

import App from './App.vue';

Vue.config.productionTip = false;
Vue.prototype.$eventBus = new Vue();

import {round} from './utils/number-utils.js';
Vue.filter('round', round);

import VueSmoothScroll from 'vue2-smooth-scroll';
Vue.use(VueSmoothScroll, {
  duration: 100
});

new Vue({
  render: h => h(App),
  router,
  store,
  i18n
}).$mount('#app');
