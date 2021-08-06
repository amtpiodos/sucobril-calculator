import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../version2/Home.vue')
  },

  {
    path: '/projects',
    name: 'Projects',
    component: () => import('../version2/ProjectsList.vue')
  },

  {
    path: '/project/:project_id/phases/:id/blocks   ',
    name: 'Blocks-With-Phase',
    component: () => import('../version2/BlocksList.vue')
  },

  {
    path: '/project/:project_id/blocks',
    name: 'Blocks-Without-Phase',
    component: () => import('../version2/BlocksList.vue')
  },

  {
    path: '/project/:id/phases',
    name: 'Phases',
    component: () => import('../version2/PhasesList.vue')
  },

  {
    path: '/project/:project_id/block/:id/lots',
    name: 'Lots',
    component: () => import('../version2/LotsList.vue')
  },

  {
    path: '/addbuyerform',
    name: "Add Buyer Form",
    component: () => import('../version2/AddBuyerForm')
  },

  {
    path: '/viewbuyer/:id',
    name: "View Buyer",
    component: () => import('../version2/ViewBuyerDetails'),
    props: true
  },

  {
    path: '/editbuyer/:id',
    name: "Edit Buyer",
    component: () => import('../version2/EditBuyerDetails'),
    props: true
  },

  {
    path: '/choose-reservation-type',
    name: 'Choose-Reservation-Type',
    component: () => import('../version2/ChooseReservationType')
  },

  {
    path: '/ra-form-2a-LO-regular-reservation',
    name: 'RA-Form-2A-LO-Regular-Reservation',
    component: () => import('../version2/LO-Regular-Reservation')
  },

  {
    path: '/ra-form-2a-LO-spot-downpayment',
    name: 'RA-Form-2A-LO-Spot-Downpayment',
    component: () => import('../version2/LO-Spot-Downpayment')
  },

  {
    path: '/ra-form-2a-LO-spot-cash',
    name: 'RA-Form-2A-LO-Spot-Cash',
    component: () => import('../version2/LO-Spot-Cash')
  }












  // {
  //   path: '/projects',
  //   name: 'Projects',
  //   component: () => import(/* webpackChunkName: "about" */ '../views/Projects.vue')
  // },
  // {
  //   path:'/blocks',
  //   name: 'Blocks',
  //   component: () => import('../views/Blocks.vue')
  // },
  // {
  //   path:'/lots',
  //   name: 'Lots',
  //   component: () => import('../views/Lots.vue')
  // },
  // {
  //   path: '/addbuyer',
  //   name: 'Add Buyer',
  //   component: () => import('../components/AddBuyer.vue')
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router