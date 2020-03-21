// Import modules or plugins
import Vue from "nativescript-vue";
import RadListView from "nativescript-ui-listview/vue";
import RadDataForm from "nativescript-ui-dataform/vue";

// Import components
import App from "./components/App";
import Login from './components/Login';

import FontIcon from 'nativescript-vue-fonticon'
import MaterialIcon from "material-design-icons";

import store from './store';

Vue.registerElement(
  'CardView',
  () => require('@nstudio/nativescript-cardview').CardView
);

Vue.use(MaterialIcon);

Vue.use(FontIcon, {
  componentName: 'FontIcon', // <-- Optional. Will be the name for component icon.
  debug: true, // <-- Optional. Will output the css mapping to console.
  paths: {
    fa: './css/all.css'
  }
});

Vue.config.silent = (TNS_ENV === "production");
Vue.use(RadListView);
Vue.use(RadDataForm);

new Vue({
  store,
  render: h => h("frame", [h(Login)])
}).$start();