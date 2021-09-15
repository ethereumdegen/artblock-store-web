<template>
  <div data-collapse="small" data-animation="default" data-duration="400" class="navbar w-nav">
    <div class=" bg-transparent">
    <div class="container w-container">
      <div class="w-full flex flex-row">
        <div class="brand">
        <img class="inline-block  " width="24" height="24" src="/logo2.png" />
        </div>
        <router-link to="/" class='brand w-nav-brand w--current flex-grow inline text-xl text-gray-900 font-bold'>BUY THE FLOOR</router-link>

 
 
       <div class="hidden lg:inline-block text-black  " >
          
         <UpperNav
          v-bind:web3Plug="web3Plug"
          />
       </div>


       <div class="inline-block lg:hidden  pull-right p-4"  >

         <button @click="showResponsiveMenu=!showResponsiveMenu" class="flex items-right px-3 py-2 border rounded text-black border-teal-400 hover:text-white hover:border-white">
          <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
        </button>

        <div v-if="showResponsiveMenu" class="w-full absolute left-0 block flex-grow lg:flex lg:items-center lg:w-auto bg-gray-200">
          <div class="text-sm lg:flex-grow">
             <AccordionNav 
             v-bind:web3Plug="web3Plug"
             />

          </div>

        </div>

       </div>

      </div>

    </div>
    </div>
  </div>
</template>


<script>
import UpperNav from './UpperNav.vue';
import AccordionNav from './AccordionNav.vue';
export default {
  name: 'Navbar',
  props: ['web3Plug'],
  components: {UpperNav,AccordionNav},
  data() {
    return {
      showResponsiveMenu: false,
    }
  },
  methods: {
  }
}
</script>