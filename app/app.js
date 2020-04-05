// Import modules or plugins
import Vue from "nativescript-vue";
import RadListView from "nativescript-ui-listview/vue";
import RadDataForm from "nativescript-ui-dataform/vue";

// Import components
import App from "./components/App";
import Login from './components/Login';

import {TNSFontIcon, fonticon} from 'nativescript-fonticon';

TNSFontIcon.debug = true;
TNSFontIcon.paths = {
  'fa': './css/fontawesome.min.css',
  'fal': './css/light.min.css',
  'far': './css/regular.min.css',
  'fas': './css/solid.min.css',
  'fab': './css/brands.min.css',
  'fad': './css/duotone.min.css'
};
TNSFontIcon.loadCss();

Vue.filter('fonticon', fonticon);

import store from './store';

Vue.registerElement(
  'CardView',
  () => require('@nstudio/nativescript-cardview').CardView
);

Vue.config.silent = (TNS_ENV === "production");
Vue.use(RadListView);
Vue.use(RadDataForm);

new Vue({
  store,
  render: h => h("frame", [h(Login)])
}).$start();