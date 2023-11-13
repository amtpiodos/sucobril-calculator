import Vue from 'vue'
import VueRouter from 'vue-router'
// import { createWebHashHistory, createWebHistory } from 'vue-router'
// import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../version2/Home.vue')
  },
]

const router = new VueRouter({
  mode: 'hash',
  // mode: process.env.IS_ELECTRON ? 'hash' : 'history',
  // history: process.env.IS_ELECTRON ? createWebHashHistory() : createWebHistory(),
  // base: process.env.BASE_URL,
  routes
})

export default router