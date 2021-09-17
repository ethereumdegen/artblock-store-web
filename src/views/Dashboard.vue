<template>

<div>

   <div class="section  bg-white border-b-2 border-black px-0 lg:px-1">

     <div class=" ">
        <Navbar 
        v-bind:web3Plug="web3Plug"
       />
     </div>


   </div>

  

   <div class="section  bg-white border-b-2 border-black">
     <div class="autospacing w-container">
        
         <div  class=" " v-if="!connectedToWeb3">
              <NotConnectedToWeb3 />

                  <div @click="web3Plug.connectWeb3( )" class="button inline-block bg-blue-500 hover:bg-blue-700 text-sm text-black font-bold my-2 py-1 px-2 rounded cursor-pointer">Login with Web3</div>

          </div>

       <div class="w-column"  v-if=" connectedToWeb3">
          <div class="text-lg font-bold"> Redirecting...  </div>
          
         
 

          
       </div>

          


     </div>
   </div>

 

    
  <Footer/>

</div>
</template>


<script>



import NotConnectedToWeb3 from './components/NotConnectedToWeb3.vue'

import Web3Plug from '../js/web3-plug.js' 


import Navbar from './components/Navbar.vue';
 
import Footer from './components/Footer.vue';
import TabsBar from './components/TabsBar.vue';
import GenericTable from './components/GenericTable.vue';
 

export default {
  name: 'Dashboard',
  props: [],
  components: {Navbar, Footer, TabsBar, GenericTable, NotConnectedToWeb3},
  data() {
    return {
      web3Plug: new Web3Plug() ,
      activePanelId: null,
      
       
      connectedToWeb3: false,
      currentBlockNumber: 0
    }
  },

  created(){

 
    this.web3Plug.getPlugEventEmitter().on('stateChanged', async function(connectionState) {
        console.log('stateChanged',connectionState);
         
        this.activeAccountAddress = connectionState.activeAccountAddress
        this.activeNetworkId = connectionState.activeNetworkId
        this.connectedToWeb3 = this.web3Plug.connectedToWeb3()
        this.currentBlockNumber = await this.web3Plug.getBlockNumber()


          if(this.activeAccountAddress){
           // window.location.href = `/accounts/+${this.activeAccountAddress}`;
            this.$router.push({ name: 'account', params: { address: this.activeAccountAddress } })
        
          }
          

        //this.$router.push({ name: 'account', params: { address: this.activeAccountAddress } })
         


      }.bind(this));
   this.web3Plug.getPlugEventEmitter().on('error', function(errormessage) {
        console.error('error',errormessage);
         
        this.web3error = errormessage
       
      }.bind(this));

      this.web3Plug.reconnectWeb()

      
        
  },
  mounted: function () {
    
   
   
  }, 
   beforeDestroy(){
    this.web3Plug.clearEventEmitter()
  },
  methods: {
         

            
  }
}
</script>
