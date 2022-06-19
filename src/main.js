// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from "axios";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Valid from './utils/valid'

import "./css/login.css"
import "./css/home.css"
import "./css/video.css"
import "./css/base.css"
import "./js/stack.js"

import VueVideoPlayer from 'vue-video-player';
import 'video.js/dist/video-js.css';
Vue.use(VueVideoPlayer);
require.config({
  paths : {
    "jquery" : ["http://libs.baidu.com/jquery/2.0.3/jquery"]
  }
})

Vue.use(ElementUI);
Vue.prototype.$axios = axios
Vue.config.productionTip = false
Vue.prototype.$Valid = Valid;


new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
