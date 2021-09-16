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

            <a class="text-sm font-bold" v-bind:href="getProjectURL()"> {{getCollectionName() }} </a>

            <div> 
              Owned By 
              
              <router-link  :to="'/account/'+tokenOwnerAddress"  >  {{getOwnerAddress()}}   </router-link> 
              
            </div>

          </div>

           <div class="py-2" v-if="ownedByLocalUser()">

                <div v-if="bestSellOrder " class='my-2'>
                    <div class="p-2 border-2 border-black inline-block rounded bg-blue-500 text-white hover:bg-blue-400  select-none"  > For Sale: {{ getBuyoutPrice() }} ETH </div>
          
                  <div class="mx-2 p-1 border-2 border-black cursor-pointer inline-block rounded bg-red-500 text-white hover:bg-red-400  select-none" @click="cancelBuyout( bestSellOrder )"  > Cancel </div>

                   <div class="p-2 border-2 border-black inline cursor-pointer rounded hover:bg-purple-200 select-none" @click="interactionMode='makeSellOrder'"> Lower Price </div>
          
                 </div>
                 


             <div v-if="!bestSellOrder " class='my-2'>
                <div class="p-2 border-2 border-black inline cursor-pointer rounded hover:bg-purple-200 select-none" @click="interactionMode='makeSellOrder'"> Sell This Item </div>
            </div>
          </div>

           <div class="py-2" v-if="!ownedByLocalUser()">


            <div v-if="bestSellOrder && getBuyoutPrice()" class='my-2'>
               <div class="p-2 border-2 border-black inline-block cursor-pointer rounded bg-blue-500 text-white hover:bg-blue-400  select-none"  @click="buyoutNow"> Buyout For {{ getBuyoutPrice() }} ETH </div>
            </div>




            
                <div class="p-2 my-2 border-2 border-black inline-block cursor-pointer rounded hover:bg-purple-200  select-none"  @click="interactionMode='makeBuyOrder'"> Bid For This Item </div>
  
            

           
          </div>


       </div>

     </div>
   </div>


    
   <div class="section  bg-white border-b-2 border-black">
     <div class="autospacing w-container flex">
        
       <div class="w-column w-1/2">

          
            <OffersList 
            ref="OffersList"
            v-bind:web3Plug="web3Plug"
            v-bind:nftContractAddress="nftContractAddress"
            v-bind:nftTokenId="nftTokenId"
            v-bind:tokenOwnerAddress="tokenOwnerAddress"
            v-bind:activeAccountAddress="activeAccountAddress"
            
            />


          


       </div>

         <div class="w-column w-1/2 m-4 p-4 bg-gray-200 rounded" v-if="interactionMode=='makeSellOrder' || interactionMode=='makeBuyOrder'">

          <div class="py-2 " v-if="interactionMode=='makeSellOrder'">

            <SellOrderForm 
            v-bind:web3Plug="web3Plug"
            v-bind:nftContractAddress="nftContractAddress"
            v-bind:nftTokenId="nftTokenId"
            v-bind:orderSubmittedCallback="onOrderSubmitted"
            />
 

          </div>


           <div class="py-2" v-if="interactionMode=='makeBuyOrder'">
 
            <BuyOrderForm 
            v-bind:web3Plug="web3Plug"
            v-bind:nftContractAddress="nftContractAddress"
            v-bind:nftTokenId="nftTokenId"
            v-bind:orderSubmittedCallback="onOrderSubmitted"
            
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
import AssetDataHelper from '../js/asset-data-helper'

const FrontendConfig = require('./config/FrontendConfig.json')
const StoreContractABI = require( '../contracts/BlockStoreABI.json'  )

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
      interactionMode: null ,

      activeAccountAddress: null,

      bestSellOrder:null

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

        await this.fetchOrdersForToken()

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
        let typeName = AssetDataHelper.getProjectNameForAsset(this.nftContractAddress, this.nftTokenId)
        let tokenId = this.nftTokenId

        return typeName + ' ' + '#' + tokenId

        //return 'unknown asset'
      },

      getCollectionExplorerURL(){
        return this.web3Plug.getExplorerLinkForAddress(this.nftContractAddress)
      },


      getProjectURL(){  

        let projectId = 0

        if( this.nftTokenId >= 1000000 ) {

          let projectId = parseInt(this.nftTokenId) / 1000000

        }


       
        return '/project/'+projectId
      },

      getCollectionName(){
          //make this come from a giant config file that uses contract address and token id to look up 
      
        return AssetDataHelper.getCollectionNameForAsset(this.nftContractAddress, this.nftTokenId)
      },

     

       getOwnerAddress(){ 

         if(this.ownedByLocalUser()) return 'You'
        
        return this.tokenOwnerAddress
      },

      ownedByLocalUser(){
        if(!this.tokenOwnerAddress || !this.activeAccountAddress ) return false 


        return this.tokenOwnerAddress.toLowerCase() == this.activeAccountAddress.toLowerCase()
      },

      async onOrderSubmitted(){

        // await this.fetchTokenData() 

        await this.fetchOrdersForToken()

      },


      getBuyoutPrice(){

        if(this.bestSellOrder){
          return  parseFloat(  this.web3Plug.rawAmountToFormatted( this.bestSellOrder.currencyTokenAmount ,18  )   )
        }

        return null
      },

      async buyoutNow(){
         

        let orderToFulfill = this.bestSellOrder

        let contractData = this.web3Plug.getContractDataForActiveNetwork() ;

        let storeContractAddress = contractData['blockstore'].address
 
        let orderInputs = [
          orderToFulfill.orderCreator, 
          orderToFulfill.nftContractAddress,
          orderToFulfill.nftTokenId,
          orderToFulfill.currencyTokenAddress,
          orderToFulfill.currencyTokenAmount,
          orderToFulfill.expires,
          orderToFulfill.signature
        ]

        let txEthValue = 0 

        const NATIVE_ETH = "0x0000000000000000000000000000000000000010"

        
        if(orderToFulfill.currencyTokenAddress == NATIVE_ETH){
          txEthValue = parseInt( orderToFulfill.currencyTokenAmount )
        }
        

        let storeContract = this.web3Plug.getCustomContract( StoreContractABI, storeContractAddress )
  
        let response = await storeContract.methods.buyNFTUsingSellOrder(  ...orderInputs  )
        .send({from: this.web3Plug.getActiveAccountAddress() , value:  txEthValue  })

        console.log('response',response)


      },


      async cancelBuyout( orderToCancel ){
        let contractData = this.web3Plug.getContractDataForActiveNetwork() ;

        let storeContractAddress = contractData['blockstore'].address


        //solve bn parsing 
 
        let orderInputs = [
          orderToCancel.orderCreator, 
          orderToCancel.isSellOrder,
          orderToCancel.nftContractAddress,
          orderToCancel.nftTokenId,
          orderToCancel.currencyTokenAddress,
          orderToCancel.currencyTokenAmount,
          orderToCancel.expires,
          orderToCancel.signature
        ]

         let storeContract = this.web3Plug.getCustomContract( StoreContractABI, storeContractAddress )
  
        let response = await storeContract.methods.cancelOffchainOrder(  ...orderInputs  )
        .send({from: this.web3Plug.getActiveAccountAddress()   })

        console.log('response',response)

      },
      

       async fetchTokenData(){

            let results = await StarflaskAPIHelper.resolveStarflaskQuery( FrontendConfig.tokenDataApiRoot+'/api/v1/apikey', {"requestType": "ERC721_by_token", "input":{"contractAddress":this.nftContractAddress,"tokenId":  this.nftTokenId}  }    )

            console.log('fetchedTokenData',results )

            let output = results.output[0]

            if(output){
              this.tokenOwnerAddress = output.accountAddress
            }
            

      },

 

      async fetchOrdersForToken(){

          //update the buy offers list 
         this.$refs.OffersList.fetchBuyOffers() 


        //update the buyout button 
         let response = await StarflaskAPIHelper.resolveStarflaskQuery( FrontendConfig.marketApiRoot+'/api/v1/apikey', {"requestType": "get_orders_for_token", "input":{"contractAddress":this.nftContractAddress,"tokenId":  this.nftTokenId}  }    )

        
         let ordersForNFT = response.output.slice(0,5000)

          
          
         let ordersFromOwner = ordersForNFT.filter(x => x.orderCreator.toLowerCase() == this.tokenOwnerAddress.toLowerCase()  )

 

         let buyOrders = ordersFromOwner.filter(x => x.isSellOrder == false  )
         let sellOrders = ordersFromOwner.filter(x => x.isSellOrder == true  )

          
         this.bestSellOrder = await this.getBestSellOrder( sellOrders )


      },



      async getBestSellOrder(allSellOrders){


        let currentBlockNumber = await this.web3Plug.getBlockNumber()
        let unexpiredOrders = allSellOrders.filter(x => x.expires > currentBlockNumber)

        

        if(unexpiredOrders.length > 0 ){
       
           unexpiredOrders.sort( (a,b) => { return a.currencyTokenAmount - b.currencyTokenAmount  }   )

           console.log('unexpiredOrders',unexpiredOrders  )

          let bestPrice = unexpiredOrders[0]

          
           
          return bestPrice
        }

        return null 

      }



  }
}
</script>
