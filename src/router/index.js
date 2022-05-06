import Vue from 'vue'
import Router from 'vue-router'
import login from "../views/login";

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login.vue'),
    },
    {
      path: '/',
      name: 'login',
      component: () => import('../views/login.vue'),
    },
    {
      path: '/Home',
      name: 'Home',
      component: () => import('../views/Home.vue'),
    }
  ]
})
