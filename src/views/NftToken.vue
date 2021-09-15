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
     <div class="autospacing w-container flex">
        
       <div class="w-column w-1/2">
          <div class="m-4 p-4 border-2 border-gray-500" style="min-height:50px"> 

             <img v-bind:src="getImageURL()" width="100%"   />

  

          </div>
       </div>

         <div class="w-column w-1/2 m-4 p-4">
          <div> Show </div>
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

export default {
  name: 'Home',
  props: [],
  components: {Navbar, Footer},
  data() {
    return {
      web3Plug: new Web3Plug() ,
      nftContractAddress: null,
      nftTokenId: null,
    }
  },
  mounted: function () {

    this.nftContractAddress = this.$route.params.contractAddress
    this.nftTokenId = this.$route.params.tokenId

    console.log('meep',this.nftContractAddress,this.nftTokenId)

    this.web3Plug.reconnectWeb()
    this.web3Plug.getPlugEventEmitter().on('stateChanged', function(connectionState) {
        console.log('stateChanged',connectionState);
         
        this.activeAccountAddress = connectionState.activeAccountAddress
        this.activeNetworkId = connectionState.activeNetworkId
         
      }.bind(this));
   this.web3Plug.getPlugEventEmitter().on('error', function(errormessage) {
        console.error('error',errormessage);
         
        this.web3error = errormessage
        // END CUSTOM CODE
      }.bind(this));
   
    
  }, 
  methods: {
              
      getLinkUrl(){

        //return `https://artblocks.io/token/${this.nftTokenId}.png` 
        return `/collection/${this.nftContractAddress}/${this.nftTokenId}` 
      },

      getImageURL(){

        return `https://media.artblocks.io/${this.nftTokenId}.png` 

      }
  }
}
</script>
