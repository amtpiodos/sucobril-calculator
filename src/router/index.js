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
    component: () => import('../version2/RA-Form-2A-LO-Regular-Reservation')
  },

  {
    path: '/ra-form-2a-LO-spot-downpayment',
    name: 'RA-Form-2A-LO-Spot-Downpayment',
    component: () => import('../version2/RA-Form-2A-LO-Spot-Downpayment')
  },

  {
    path: '/ra-form-2a-LO-spot-cash',
    name: 'RA-Form-2A-LO-Spot-Cash',
    component: () => import('../version2/RA-Form-2A-LO-Spot-Cash')
  },

  {
    path: '/ra-form-1a-HL-regular-reservation',
    name: 'RA-Form-1A-HL-Regular-Reservation',
    component: () => import('../version2/RA-Form-1A-HL-Regular-Reservation')
  },

  {
    path: '/ra-form-1a-HL-with-spot-equity',
    name: 'RA-Form-1A-HL-With-Spot-Equity',
    component: () => import('../version2/RA-Form-1A-HL-With-Spot-Equity')
  },

  {
    path: '/ra-form-1a-HL-spot-cash-tcp',
    name: 'RA-Form-1A-HL-Spot-Cash-TCP',
    component: () => import('../version2/RA-Form-1A-HL-Spot-Cash-TCP')
  },

  {
    path: '/ra-form-1a-HL-deferred-cash',
    name: 'RA-Form-1A-HL-Deferred-Cash',
    component: () => import('../version2/RA-Form-1A-HL-Deferred-Cash')
  },

  {
    path: '/view-buyer-form-2a-LO-regular-reservation/:id',
    name: 'View-Buyer-Form-2A-LO-Regular-Reservation',
    component: () => import('../version2/View-Buyer-Form-2A-LO-Regular-Reservation')
  },

  {
    path: '/view-buyer-form-2a-LO-spot-downpayment/:id',
    name: 'View-Buyer-Form-2A-LO-Spot-Downpayment',
    component: () => import('../version2/View-Buyer-Form-2A-LO-Spot-Downpayment')
  },

  {
    path: '/view-buyer-form-2a-LO-spot-cash/:id',
    name: 'View-Buyer-Form-2A-LO-Spot-Cash',
    component: () => import('../version2/View-Buyer-Form-2A-LO-Spot-Cash')
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
  // mode: process.env.IS_ELECTRON ? 'hash' : 'history',
  // history: process.env.IS_ELECTRON ? createWebHashHistory() : createWebHistory(),
  base: process.env.BASE_URL,
  routes
})

export default router