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

          <div class="py-2">

            <div class="text-lg"> {{getAssetName() }} </div>

            <a class="text-sm font-bold" v-bind:href="getCollectionExplorerURL()"> {{getCollectionName() }} </a>

            <div> Owned By {{getOwnerAddress()}} </div>

          </div>

           <div class="py-2" v-if="ownedByLocalUser()">

            <div class="p-2 border-2 border-black inline cursor-pointer rounded hover:bg-purple-200 select-none" @click="interactionMode='makeSellOrder'"> Sell This Item </div>
  
          </div>

           <div class="py-2" v-if="!ownedByLocalUser()">

            <div class="p-2 border-2 border-black inline cursor-pointer rounded hover:bg-purple-200  select-none"  @click="interactionMode='makeBuyOrder'"> Bid For This Item </div>
  
          </div>


       </div>

     </div>
   </div>


    
   <div class="section  bg-white border-b-2 border-black">
     <div class="autospacing w-container flex">
        
       <div class="w-column w-1/2">

           <div class="py-2" v-if="ownedByLocalUser()">

            <OffersList 
            v-bind:web3Plug="web3Plug"
            v-bind:nftContractAddress="nftContractAddress"
            v-bind:nftTokenId="nftTokenId"
            
            />


          </div>


       </div>

         <div class="w-column w-1/2 m-4 p-4 bg-gray-200 rounded" v-if="interactionMode=='makeSellOrder' || interactionMode=='makeBuyOrder'">

          <div class="py-2 " v-if="interactionMode=='makeSellOrder'">

            <SellOrderForm 
            v-bind:web3Plug="web3Plug"
            v-bind:nftContractAddress="nftContractAddress"
            v-bind:nftTokenId="nftTokenId"
            
            />

           
             

          </div>


           <div class="py-2" v-if="interactionMode=='makeBuyOrder'">
 
            <BuyOrderForm 
            v-bind:web3Plug="web3Plug"
            v-bind:nftContractAddress="nftContractAddress"
            v-bind:nftTokenId="nftTokenId"
            
            />

           
             

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

import OffersList from './components/OffersList.vue'

import BuyOrderForm from './components/BuyOrderForm.vue'
import SellOrderForm from './components/SellOrderForm.vue';

import StarflaskAPIHelper from '../js/starflask-api-helper'


export default {
  name: 'Home',
  props: [],
  components: {Navbar, Footer, SellOrderForm, BuyOrderForm, OffersList},
  data() {
    return {
      web3Plug: new Web3Plug() ,
      nftContractAddress: null,
      nftTokenId: null,
      tokenOwnerAddress: null,
      interactionMode: null 

    }
  },
  mounted: function () {

    this.nftContractAddress = this.$route.params.contractAddress
    this.nftTokenId = parseInt( this.$route.params.tokenId )

   
    
    this.web3Plug.getPlugEventEmitter().on('stateChanged', async function(connectionState) {
        console.log('stateChanged',connectionState);
         
        this.activeAccountAddress = connectionState.activeAccountAddress
        this.activeNetworkId = connectionState.activeNetworkId
     
        await this.fetchTokenData() 

        this.$forceUpdate();


      }.bind(this));
   this.web3Plug.getPlugEventEmitter().on('error', function(errormessage) {
        console.error('error',errormessage);
         
        this.web3error = errormessage
        // END CUSTOM CODE
      }.bind(this));
    this.web3Plug.reconnectWeb()
    
  }, 
  methods: {
              
      getLinkUrl(){

        //return `https://artblocks.io/token/${this.nftTokenId}.png` 
        return `/collection/${this.nftContractAddress}/${this.nftTokenId}` 
      },

      getImageURL(){

        return `https://media.artblocks.io/${this.nftTokenId}.png` 

      },

      getAssetName(){
        //make this come from a giant config file that uses contract address and token id to look up 
        let typeName = 'Chromie Squiggle'
        let tokenId = this.nftTokenId

        return typeName + ' ' + '#' + tokenId

        //return 'unknown asset'
      },

      getCollectionExplorerURL(){
        return this.web3Plug.getExplorerLinkForAddress(this.nftContractAddress)
      },

      getCollectionName(){
          //make this come from a giant config file that uses contract address and token id to look up 
      
        return 'Artblocks Curated'
      },

     

       getOwnerAddress(){ 

         if(this.ownedByLocalUser()) return 'You'
        
        return this.tokenOwnerAddress
      },

      ownedByLocalUser(){
        if(!this.tokenOwnerAddress || !this.activeAccountAddress ) return false 


        return this.tokenOwnerAddress.toLowerCase() == this.activeAccountAddress.toLowerCase()
      },

      

       async fetchTokenData(){

            let results = await StarflaskAPIHelper.resolveStarflaskQuery( 'https://rinkeby.starflask.com/api/v1/apikey', {"requestType": "ERC721_by_token", "input":{"contractAddress":this.nftContractAddress,"tokenId":  this.nftTokenId}  }    )

            console.log('results',results )

            let output = results.output[0]

            if(output){
              this.tokenOwnerAddress = output.accountAddress
            }
            

      },



  }
}
</script>
