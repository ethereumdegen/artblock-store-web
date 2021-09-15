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
        
       <div class="w-column">


         

          <div class="text-lg font-bold"> Sell an NFT </div>
          
         
          <div  class=" "  >


             

            <div  >


              <NFTGallery 
              ref="gallery"
              v-bind:web3Plug="web3Plug"
              
              />





              <div class="text-lg font-bold  mt-8  "> All NFT types </div>

                   <ArtTypeTile v-for="type of nftTypes"
                      v-bind:type="type"
                      v-bind:imageURL="type.imgurl" 
                    

                    />
 

              </div>


         




          </div>


          
       </div>
     </div>
   </div>


    


    
  <Footer/>

</div>
</template>


<script>



import Web3Plug from '../js/web3-plug.js' 


import Navbar from './components/Navbar.vue';
 
import Footer from './components/Footer.vue';

import ArtTypeTile from './components/ArtTypeTile.vue'
 
 import NFTGallery from './components/NFTGallery.vue'

import NotConnectedToWeb3 from './components/NotConnectedToWeb3.vue'

import BuyTheFloorHelper from '../js/buythefloor-helper.js'

export default {
  name: 'StartSelling',
  props: [],
  components: {Navbar, Footer,NotConnectedToWeb3, ArtTypeTile, NFTGallery },
  data() {
    return {
      web3Plug: new Web3Plug() ,
      nftTypes:  [],
      connectedToWeb3: false 
    }
  },
  async created  () {
   
    this.web3Plug.getPlugEventEmitter().on('stateChanged', function(connectionState) {
        console.log('stateChanged',connectionState);
         
        this.activeAccountAddress = connectionState.activeAccountAddress
        this.activeNetworkId = connectionState.activeNetworkId
         
        this.connectedToWeb3 = this.web3Plug.connectedToWeb3()
        this.nftTypes = BuyTheFloorHelper.getClientConfigForNetworkId(this.web3Plug.getActiveNetId()).nftTypes

        if(this.$refs.gallery){
          this.$refs.gallery.fetchOwnedTokenIds()
        }
        


        
      }.bind(this));
   this.web3Plug.getPlugEventEmitter().on('error', function(errormessage) {
        console.error('error',errormessage);
         
        this.web3error = errormessage
        
      }.bind(this));


      this.web3Plug.reconnectWeb()


    let chainId = this.web3Plug.getActiveNetId()
    if(!chainId){
      chainId = 1
    }

    this.nftTypes = BuyTheFloorHelper.getClientConfigForNetworkId(chainId).nftTypes
    
  }, 
   beforeDestroy(){
    this.web3Plug.clearEventEmitter()
  },
  methods: {
         
  }
}
</script>
