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
          </div>


  <div class="w-column text-center mb-8"  v-if=" connectedToWeb3">
           <div class="text-md font-bold "> User Profile  </div>

          <div class="text-md  "> {{ this.activeAccountAddress }}  </div>
           
          <div  class=" "  >
 

            <div  >

            

           </div>


          </div>


          
       </div>



           <div class="w-column"  v-if=" connectedToWeb3">
          <div class="text-lg font-bold"> Owned NFTs  </div>
          
         

          <div  class=" "  >

             
            

            <div  >

              <NftTile
                v-for="item in allOwnedNFTs"
                v-bind:key="item.nftContractAddress.concat('_').concat(item.nftTokenId)"
              
                v-bind:nftContractAddress="item.nftContractAddress"
                v-bind:nftTokenId="item.nftTokenId"

                v-bind:clickedTileCallback="clickedTileCallback"
               />

           </div>


          </div>


          
       </div>




       <div class="w-column hidden "  v-if=" connectedToWeb3">
          <div class="text-lg font-bold"> Your Active Bids  </div>
          
         

          <div  class=" "  >

             
            

            <div v-if="selectedTab=='bids'" class="mb-4 ">

              <GenericTable
                v-bind:labelsArray="['nftType','currencyType','bidAmount','expires']"
                v-bind:rowsArray="activeBidRowsArray"
                
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

import web3 from 'web3'

import NotConnectedToWeb3 from './components/NotConnectedToWeb3.vue'

import Web3Plug from '../js/web3-plug.js' 


import Navbar from './components/Navbar.vue';
 
import Footer from './components/Footer.vue';
import TabsBar from './components/TabsBar.vue';
import GenericTable from './components/GenericTable.vue';

//import BidPacketHelper from '../js/bidpacket-helper.js'
 
//import BuyTheFloorHelper from '../js/buythefloor-helper.js'

import StarflaskAPIHelper from '../js/starflask-api-helper'

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

      allOwnedNFTs:[ ],
       
      connectedToWeb3: false,
      currentBlockNumber: 0
    }
  },
  watch: {
   
  },
  created(){

  

  },
  
  mounted: function () {
    
     this.reconnectWeb3()

      //this.populateContractAddressLookupTable()

       
     // this.fetchBidsData()
   
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

            await this.fetchOwnedTokens()

            //this.fetchBidsData()
            
          }.bind(this));
             this.web3Plug.getPlugEventEmitter().on('error', function(errormessage) {
            console.error('error',errormessage);
            
            this.web3error = errormessage
          
          }.bind(this));

          this.web3Plug.reconnectWeb()
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

          async fetchOwnedTokens(){
            
            let results = await StarflaskAPIHelper.resolveStarflaskQuery( 'https://rinkeby.starflask.com/api/v1/apikey', {"requestType": "ERC721_balance_by_owner", "input":{"publicAddress": this.activeAccountAddress }  }   )

            console.log('results',results )

            this.allOwnedNFTs = []


            for(let result of results.output){
              for(let tokenId of result.tokenIds){
                this.allOwnedNFTs.push({nftContractAddress: result.contractAddress, nftTokenId: tokenId})
              }
            }

          },

         /* async fetchBidsData(){
             var hostname = window.location.hostname; 

                 
            let serverURL = BuyTheFloorHelper.getSocketURL(this.web3Plug.getActiveNetId())  
            console.log('serverURL',serverURL)

            let contractData = this.web3Plug.getContractDataForActiveNetwork()

            if(!contractData)return; 
            let btfContractAddress = contractData['buythefloor'].address


            let query = {bidderAddress: this.web3Plug.getActiveAccountAddress() , exchangeContractAddress: btfContractAddress }

            let bidPackets = await BidPacketHelper.getBidPackets(serverURL,query)
            console.log('bidPackets',bidPackets)

           
            let chainId = this.web3Plug.getActiveNetId()


          this.activeBidRowsArray=[]
          this.inactiveBidRowsArray=[]
            for(let packet of bidPackets){

              if(packet.status == 'active' && packet.suspended == false){
                  this.activeBidRowsArray.push(this.getBidRowFromPacket(packet,chainId))
              }else{
                 this.inactiveBidRowsArray.push(this.getBidRowFromPacket(packet,chainId))
              }

            }
            

            
          },

          getBidRowFromPacket(pkt,chainId){ 
            
            return{
                  nftContractAddress: BuyTheFloorHelper.getNameFromContractAddress(pkt.nftContractAddress,pkt.projectId,chainId),
                  currencyTokenAddress: BuyTheFloorHelper.getNameFromContractAddress(pkt.currencyTokenAddress,0,chainId),
                  currencyTokenAmount: BuyTheFloorHelper.getFormattedCurrencyAmount(pkt.currencyTokenAmount,pkt.currencyTokenAddress, chainId) ,
                  expires: pkt.expires,
                  signature: pkt.signature.signature,
                  suspended: pkt.suspended,
                  status: pkt.status
                } 
                                                      

          },*/


           
          
          clickedTileCallback(row){
            console.log('clicked  ',row )

           
          }
  }
}
</script>
