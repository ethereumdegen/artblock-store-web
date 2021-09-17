<template>
 <div class="p-4 m-4 bg-gray-200 rounded">
     <!--  view pertinent offchain orders .. depending on who you are  --> 
       
         <div class="my-8 ">
              <label  class="block text-md font-medium font-bold text-gray-800  ">Buy Offers</label>
 
         </div>

         <div v-if="validBuyOffers.length==0"> None found. </div>


         <div> 
           <div v-for="offer of validBuyOffers" v-bind:key="offer.signature" class="px-2 border-2 border-gray-300" > 
              <div class="autospacing w-container flex">
                     <div class="truncate " style="max-width:50%"> Bid from {{ offer.orderCreator  }} </div> 
                        
                      <div class="flex-grow"> </div>
                     <div v-if=" ownedByLocalUser() " class="px-1 bg-blue-500 hover:bg-blue-700 cursor-pointer text-white text-sm rounded " @click="acceptOffer(offer)"> Sell for {{ formatCurrencyAmount( offer.currencyTokenAmount ) }} ETH </div>
                     
                     <div v-if=" !ownedByLocalUser() " class="px-1 bg-gray-200    text-sm rounded "  > Bid for {{ formatCurrencyAmount( offer.currencyTokenAmount ) }} ETH </div> 
               </div>
           </div>


         </div>

     
     
     </div> 
</template>


<script>
import StarflaskAPIHelper from '../../js/starflask-api-helper'

const StoreContractABI = require( '../../contracts/BlockStoreABI.json'  )

const FrontendConfig = require('../../config/FrontendConfig.json')

export default {
  name: 'OffersList',
  props: ['nftContractAddress',  'nftTokenId', 'web3Plug', 'tokenOwnerAddress', 'activeAccountAddress'],
  data() {
    return {
      validBuyOffers: [] 
      
    }
  },
  async created(){

   

  },

   async mounted (){

    //await this.fetchBuyOffers() 
 


  },
  methods: {
      
      async fetchBuyOffers(){

          let response = await StarflaskAPIHelper.resolveStarflaskQuery( FrontendConfig.marketApiRoot+'/api/v1/apikey',
           {"requestType": "get_orders_for_token", "input":{"contractAddress":this.nftContractAddress,"tokenId":  this.nftTokenId}  }    )

            console.log(' fetchBuyOffers response',response)

          let ordersForNFT = response.output.slice(0,5000)

          //let ordersFromOwner = ordersForNFT.filter(x => x.orderCreator.toLowerCase() == this.tokenOwnerAddress.toLowerCase()  )

          let buyOrders = ordersForNFT.filter(x => x.isSellOrder == false  ) 

           let currentBlockNumber = await this.web3Plug.getBlockNumber()
           let unexpiredBuyOrders = buyOrders.filter(x => x.expires > currentBlockNumber)

            this.validBuyOffers = unexpiredBuyOrders.sort( (a,b) => {return b.currencyTokenAmount - a.currencyTokenAmount}  )

            console.log('validBuyOffers',this.validBuyOffers)
        
 
      },

      formatCurrencyAmount(amountRaw){

        return parseFloat( this.web3Plug.rawAmountToFormatted(amountRaw,18) )

      },

      ownedByLocalUser(){
        if(!this.tokenOwnerAddress || !this.activeAccountAddress ) return false 
 
        return this.tokenOwnerAddress.toLowerCase() == this.activeAccountAddress.toLowerCase()
      },


      async acceptOffer(orderToFulfill){

        let contractData = this.web3Plug.getContractDataForActiveNetwork() ;

        let storeContractAddress = contractData['blockstore'].address
 
        let orderInputs = [
          orderToFulfill.orderCreator, 
          orderToFulfill.nftContractAddress,
          orderToFulfill.nftTokenId,
          orderToFulfill.currencyTokenAddress,
          orderToFulfill.currencyTokenAmount,
          orderToFulfill.nonce,
          orderToFulfill.expires,
          orderToFulfill.signature
        ]

        let txEthValue = 0 
 

        let storeContract = this.web3Plug.getCustomContract( StoreContractABI, storeContractAddress )
  
        let response = await storeContract.methods.sellNFTUsingBuyOrder(  ...orderInputs  )
        .send({from: this.web3Plug.getActiveAccountAddress()   })



      }
  }
}
</script>
