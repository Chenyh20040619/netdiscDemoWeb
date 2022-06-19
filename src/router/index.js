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
    },
    {
      path: '/download',
      name: 'download',
      component: () => import('../views/file/download.vue'),
    },
    {
      path: '/deleteUser',
      name: 'deleteUser',
      component: () => import('../views/user/deleteUser.vue'),
    },
    {
      path: '/updateUser',
      name: 'updateUser',
      component: () => import('../views/user/updateUser.vue'),
    },
    {
      path: '/resetPassword',
      name: 'resetPassword',
      component: () => import('../views/user/resetPassword.vue'),
    },
  ]
})
