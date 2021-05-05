import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/projects',
    name: 'Projects',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Projects.vue')
  },
  {
    path:'/blocks',
    name: 'Blocks',
    component: () => import('../views/Blocks.vue')
  },
  {
    path:'/lots',
    name: 'Lots',
    component: () => import('../views/Lots.vue')
  },
  {
    path: '/addbuyer',
    name: 'Add Buyer',
    component: () => import('../components/AddBuyer.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
