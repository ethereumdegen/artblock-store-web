import Vue from 'vue'
import Router from 'vue-router'


import Home from './views/Home.vue'
import NewBid from './views/NewBid.vue'
import Sell from './views/Sell.vue'
import Search from './views/Search.vue'
import Type from './views/Type.vue'
import nftToken from './views/nftToken.vue'
import Bid from './views/Bid.vue'
import StartSelling from './views/StartSelling.vue'

import Dashboard from './views/Dashboard.vue'


import NotFound from './views/NotFound.vue'

Vue.use(Router)

export default new Router({  
  mode: 'history',
  base: process.env.PUBLIC_URL,
  routes: [

    {
      path: '/',
      name: 'home',
      component: Home
    },

    {
      path: '/newbid/:nft_type',
      name: 'newbid',
      component: NewBid
    },

    {
      path: '/newbid',
      name: 'newbid',
      component: NewBid
    },

    {
      path: '/bid/:signature',
      name: 'bid',
      component: Bid
    },

    {
      path: '/startselling',
      name: 'startselling',
      component: StartSelling
    },

    {
      path: '/sell/:nft_type',
      name: 'sell',
      component: Sell
    },


    {
      path: '/sell/:nft_type/:token_id',
      name: 'sell',
      component: Sell
    },

    {
      path: '/search/:query',
      name: 'search',
      component: Search
    },

    {
      path: '/type/:nft_type',
      name: 'type',
      component: Type
    },


    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard
    },

    {
      path: '/nft/:contractaddress/:tokenid',
      name: 'nft',
      component: nftToken
    },

    

   
    {
      path: '/*',
      component: NotFound
    },
  ]
})
