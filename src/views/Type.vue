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
     <div class="autospacing w-container" v-if="typeData">


         

        
          <div class="text-xl font-bold mb-8 capitalize"> {{typeData.label}} </div>

           <div class="  block md:hidden ">

                  <img v-bind:src="typeData.imgurl" width="128" height="128" />

              </div>




          <div class="flex flex-row">

            <div class="flex-grow  ">  

              <div>
              
                  <div> Contract Address: <a v-bind:href="web3Plug.getExplorerLinkForAddress(contractData.address)" target="_blank">  {{  contractData.address }} </a>  </div> 
                <div v-if="contractData.projectId"> Project Id:   {{  contractData.projectId }}  </div> 


                  <div class="  mt-12  ">
                         <router-link v-bind:to="'/newbid/'.concat(typeData.name)" class="select-none bg-teal-300 no-underline p-2   text-black rounded border-black border-2 cursor-pointer"> Place a bid for any {{typeData.label}} </router-link>
                    </div>


                    <div class=" mt-12  ">
                         <router-link v-bind:to="'/sell/'.concat(typeData.name)" class="select-none bg-teal-300 no-underline p-2   text-black rounded border-black border-2 cursor-pointer"> Sell your {{typeData.label}} </router-link>
                      
                   
                    </div>
              
              </div>
           </div>

             <div class="  hidden md:block ">

                  <img v-bind:src="typeData.imgurl" width="128" height="128" />

              </div>

          </div>


           

          <div  class=" " v-if="this.filterByNFTContractAddress"  >
             
             <div class="mt-24 mb-4  ">

                <div class="text-xl mb-4"> Active Bids for {{typeData.label}} </div>

              <GenericTable
                v-bind:labelsArray="['nftType','currencyType','bidAmount','expires']"
                v-bind:rowsArray="bidRowsArray"
                v-bind:clickedRowCallback="clickedBidRowCallback"
               />


            </div>

            
  

          </div>
 

             


        
     </div>

     <div class="autospacing w-container" v-if="!typeData">
       No results found.
      </div>
   </div>


    


    
  <Footer/>

</div>
</template>


<script>

import Vue from 'vue'

import Web3Plug from '../js/web3-plug.js' 


import Navbar from './components/Navbar.vue';
 
import Footer from './components/Footer.vue';

import GenericTable from './components/GenericTable.vue'

import BidPacketUtils from '../js/bidpacket-utils.js'

import BidPacketHelper from '../js/bidpacket-helper.js'

import BuyTheFloorHelper from '../js/buythefloor-helper.js'

 

var updateTimer;

export default {
  name: 'Search',
  props: [ ],
  components: {Navbar, Footer, GenericTable },
  data() {
    return {
      web3Plug: new Web3Plug() ,
      nftTypeName: null,
      contractData:null,
      typeData: null,
      bidRowsArray:[]
      
 
    }
  },
  computed: {
     
   
  },
  created(){
this.web3Plug.getPlugEventEmitter().on('stateChanged', function(connectionState) {
        console.log('stateChanged',connectionState);
         
        //this.activeAccountAddress = connectionState.activeAccountAddress
        //this.activeNetworkId = connectionState.activeNetworkId
 
         
      }.bind(this));
   this.web3Plug.getPlugEventEmitter().on('error', function(errormessage) {
        console.error('error',errormessage);
         
        //this.web3error = errormessage
       
      }.bind(this));

      this.web3Plug.reconnectWeb()
    
 
    

  },
  mounted () {
    
     this.$nextTick(() => {
        this.populateInitialType()
    })
     
      
    
  }, 

  beforeDestroy(){
      
  },
  methods: {

    async populateInitialType(){

        let chainId = this.web3Plug.getActiveNetId()

        if(chainId==null){
          chainId = 1 
          console.log('no web3 connection')
        } 
 
       
        let contractData = this.web3Plug.getContractDataForNetworkID(chainId)

       

        if(this.$route.params.nft_type){
            this.nftTypeName = this.$route.params.nft_type.toLowerCase()
            this.contractData = contractData[this.nftTypeName]
            this.typeData = BuyTheFloorHelper.getNFTTypeDataFromName( this.nftTypeName , chainId ) // nftTypes[this.nftTypeName]

              if( this.contractData){
                this.filterByNFTContractAddress = this.contractData.address

                 this.fetchBidsData()
              }else{
                consol.log('warn: could not fetch bids ')
              }

            
          }

    },

     async fetchBidsData(){

             
             
             let chainId = this.web3Plug.getActiveNetId()

             if(chainId==null){
               chainId = 1 
               console.log('no web3 connection')
             }

              let contractData = this.web3Plug.getContractDataForNetworkID(chainId) 
             let btfContractAddress = contractData['buythefloor'].address


             
            let serverURL = BuyTheFloorHelper.getSocketURL(chainId)
            console.log('serverURL',serverURL)

            let query = {exchangeContractAddress: btfContractAddress, status:'active', suspended:false  }

             if(this.filterByNFTContractAddress){
              query.nftContractAddress = this.filterByNFTContractAddress
            }


            let bidPackets = await BidPacketHelper.getBidPackets(serverURL, query)
            console.log('bidPackets',bidPackets)

        
            
            this.bidRowsArray = bidPackets.map(pkt => (
                                                           {
                                                            nftContractAddress: BuyTheFloorHelper.getNameFromContractAddress(pkt.nftContractAddress,pkt.projectId, chainId),
                                                            
                                                            currencyTokenAddress: BuyTheFloorHelper.getNameFromContractAddress(pkt.currencyTokenAddress, 0, chainId),
                                                            currencyTokenAmount: BuyTheFloorHelper.getFormattedCurrencyAmount(pkt.currencyTokenAmount,pkt.currencyTokenAddress, chainId),
                                                            expires: pkt.expires,

                                                            requireProjectId: pkt.requireProjectId,
                                                            projectId: pkt.projectId,
                                                            signature: pkt.signature.signature
                                                          } 
                                                        ))

             this.bidRowsArray.sort(function(a, b) {
              return b.currencyTokenAmount - a.currencyTokenAmount;
            })
          },

             clickedBidRowCallback(row){
            console.log('clicked bid row',row )

            this.$router.push({ path: `/bid/${row.signature}` })
          },
    
        
          
 
  }
}
</script>
