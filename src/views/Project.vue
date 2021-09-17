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
           <div class="text-xl">  {{ this.projectData.name }}  </div>



            <div class="my-8">
              
                 <div class=" ">  For Sale  </div>


                 
                 <div class="text-xs" v-if="validSellOrders.length == 0"> Nothing found. </div>


                  <div class="border-2 border-gray-200 p-2 m-2 overflow-y-scroll"  v-if="validSellOrders.length > 0" style="max-height:500px">
                    

                        <div v-for="offer in validSellOrders" v-bind:key="offer.signature"> 
                          
                            <div class="  my-1     flex">
                                <div class="truncate " style="max-width:50%">   {{ offer.orderCreator  }} </div> 
                                    
                                  <div class="flex-grow"> </div>
                                 
                                <router-link :to="'/collection/'+offer.nftContractAddress+'/'+offer.nftTokenId" class="px-1 bg-gray-200 cursor-pointer hover:bg-blue-400  text-sm rounded "  > Selling for {{ formatCurrencyAmount( offer.currencyTokenAmount ) }} ETH </router-link> 
                          </div>
                          
                         </div>


                  </div>

                 

              
              
            </div>


            <div class="my-8">
              
                 <div class=" ">  Bid Offers  </div>


                 <div class="text-xs" v-if="validBuyOrders.length == 0"> Nothing found. </div>

                 <div class="border-2 border-gray-200 p-2 m-2 overflow-y-scroll"  v-if="validBuyOrders.length > 0" style="max-height:500px">
                     
                    <div v-for="offer in validBuyOrders" v-bind:key="offer.signature"> 
                      
                      
                      
                      <div class=" my-1   flex">
                                <div class="truncate " style="max-width:50%">   {{ offer.orderCreator  }} </div> 
                                    
                                  <div class="flex-grow"> </div>
                                 
                                <router-link  :to="'/collection/'+offer.nftContractAddress+'/'+offer.nftTokenId"  class="px-1 bg-gray-200 cursor-pointer  hover:bg-blue-400  text-sm rounded "  > Bid for {{ formatCurrencyAmount( offer.currencyTokenAmount ) }} ETH </router-link> 
                          </div> </div>





                  </div>
              
              
            </div>










       </div>
 
        
       <div class="w-column w-1/2">
          <div class="m-4 p-4 border-2 border-gray-500" style="min-height:50px"> 

             <img v-bind:src="getImageURL()" width="100%"   />

  

          </div>



          
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

import StarflaskAPIHelper from '../js/starflask-api-helper'
import AssetDataHelper from '../js/asset-data-helper'
//import BidPacketHelper from '../js/bidpacket-helper.js'
 
//import BuyTheFloorHelper from '../js/buythefloor-helper.js'

const FrontendConfig = require('../config/FrontendConfig.json')
 

import NftTile from './components/NftTile.vue'

export default {
  name: 'Account',
  props: [],
  components: {Navbar, Footer, TabsBar, GenericTable,NftTile, NotConnectedToWeb3},
  data() {
    return {
      web3Plug: new Web3Plug() ,
      activePanelId: null,
      selectedTab:"bids",
      activeBidRowsArray:[],
      inactiveBidRowsArray:[],

      validSellOrders: [],
      validBuyOrders: [],

      projectId: null,

        
      connectedToWeb3: false,
      currentBlockNumber: 0
    }
  },
  watch: {
   
  },
  async created(){

    this.projectId = parseInt( this.$route.params.projectId )
 
    this.projectData = AssetDataHelper.getProjectDataForProjectId( this.projectId ) 

     

  },
  
  mounted: function () {
    
     this.reconnectWeb3()

       
   
  }, 
   beforeDestroy(){
    this.web3Plug.clearEventEmitter()
  },
  methods: {
          reconnectWeb3(){
            this.web3Plug.getPlugEventEmitter().on('stateChanged', async function(connectionState) {
            console.log('stateChanged',connectionState);
            
            this.activeAccountAddress = connectionState.activeAccountAddress
            this.activeNetworkId = connectionState.activeNetworkId
            this.connectedToWeb3 = this.web3Plug.connectedToWeb3()
            this.currentBlockNumber = await this.web3Plug.getBlockNumber()

            await this.fetchOrdersForProjectId( this.projectId  )
            //thisfetchBidsData()
            
          }.bind(this));
             this.web3Plug.getPlugEventEmitter().on('error', function(errormessage) {
            console.error('error',errormessage);
            
            this.web3error = errormessage
          
          }.bind(this));

          this.web3Plug.reconnectWeb()
          },

          formatCurrencyAmount(amountRaw){

              return parseFloat( this.web3Plug.rawAmountToFormatted(amountRaw,18) )

            },


          setActivePanel(panelId){
              if(panelId == this.activePanelId){
                this.activePanelId = null;
                return 
              }
               this.activePanelId = panelId ;
          },
          onTabSelect(tabname){
            console.log(tabname)




          },

          async fetchOrdersForProjectId(projectId ){


             let contractData = this.web3Plug.getContractDataForActiveNetwork() ;


            let contractAddress = contractData['artblocks'].address;

            let tokenIdStart= projectId * 1000000 

            if( projectId == 0 ){
              contractAddress = contractData['artblocks_legacy'].address; 
            
            } 

            let tokenIdMin = tokenIdStart+0
            let tokenIdMax = tokenIdStart+999999
            

            let minTokenId = projectId


                let response = await StarflaskAPIHelper.resolveStarflaskQuery( FrontendConfig.marketApiRoot+'/api/v1/apikey',
                {"requestType": "get_orders_for_token_range", "input":{"contractAddress":contractAddress,"tokenIdStart":  tokenIdMin, "tokenIdEnd":  tokenIdMax}  }    )

                 

                if(!response.output) return 

                let ordersForNFT = response.output.slice(0,5000)

                
                let buyOrders = ordersForNFT.filter(x => x.isSellOrder == false  ) 
                 let sellOrders = ordersForNFT.filter(x => x.isSellOrder == true  ) 

                let currentBlockNumber = await this.web3Plug.getBlockNumber()
                let unexpiredBuyOrders = buyOrders.filter(x => x.expires > currentBlockNumber)
                let unexpiredSellOrders = sellOrders.filter(x => x.expires > currentBlockNumber)

                this.validBuyOrders = unexpiredBuyOrders.sort( (a,b) => {return b.currencyTokenAmount - a.currencyTokenAmount}  )
                this.validSellOrders = unexpiredSellOrders.sort( (a,b) => {return a.currencyTokenAmount - b.currencyTokenAmount}  )

                  console.log('validBuyOffers',this.validBuyOffers)
                  console.log('validSellOffers',this.validSellOffers)

          },


       getImageURL(){


         let previewTokenId = this.projectId * 1000000 + parseInt(Math.random()*6)

        return `https://media.artblocks.io/${previewTokenId}.png` 

      },
  }
}
</script>
