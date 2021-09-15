<template>
  <div class=" ">
        
        <div class="mb-4 my-4">
            <label   class="block text-md    text-gray-800  ">NFT Contract Address</label>
            <a v-bind:href="web3Plug.getExplorerLinkForAddress(nftContractAddress)"  target="_blank" class="block text-md    "> {{nftContractAddress}}</a>
        </div>

         <div  class=" " v-if="!connectedToWeb3">
              <NotConnectedToWeb3 />


 


          </div>

        <div  class=" " v-if=" connectedToWeb3">


          <div class="mb-4 " v-if="!ownedTokenIdToSell">


              
                  <label   class="block text-md font-medium font-bold text-gray-800  ">NFT Token ID To Sell</label>

            

              <div class="flex flex-row"  >
                  <div class="w-1/2 px-4">
                      <input type="text"   v-model="nftTokenIdToSell"  
                      class="text-gray-900 border-2 border-black font-bold px-4 text-xl focus:ring-indigo-500 focus:border-indigo-500 block w-full py-4 pl-7 pr-12   border-gray-300 rounded-md" placeholder="1">
                  </div>

                    <div class="  p-4">
                      <div @click="selectTokenIdToSell()" class="select-none bg-teal-300 p-2 inline-block rounded border-black border-2 cursor-pointer"> Continue </div>
                  </div>

                  
              </div>




              <NFTGallery 
              v-bind:web3Plug="web3Plug"
              v-bind:nftContractAddress="nftContractAddress"
              v-bind:projectId="projectId"
              />






          
            </div>

          </div>


           <div class="mb-4 " v-if="ownedTokenIdToSell">
             <div v-cloak>
                <div class="inline mr-4">Token ID To Sell: {{ownedTokenIdToSell}}</div>


                  <label v-if="isTheOwnerOfSelectedToken()"  class="block text-md font-medium font-bold text-white bg-green-500 inline p-1 ">You are the owner</label>
                 
                 <label  v-if="!isTheOwnerOfSelectedToken()" class="block text-md font-medium font-bold text-white bg-red-500 inline p-1">You are not the owner</label>
                 
                  
              </div>

              <div v-cloak v-if="selectedBidPacket && selectedBidPacket.requireProjectId">
                 
                  <div class="inline mr-4">Token Project ID : {{projectIdOfSelectedToken}}</div>
                 <label  v-if="selectedBidPacket&& selectedBidPacket.projectId != projectIdOfSelectedToken" class="block text-md font-medium font-bold text-white bg-red-500 inline p-1">Token ProjectId Mismatch</label>
                 
              </div>
 
                
                <div v-if="!selectedBidPacket">
                  <div class="text-lg my-4 font-bold">Top Bids To Fulfill</div>

                   <div class="mb-4">
                        <label class="block text-md font-medium font-bold text-gray-800  ">Filter by Currency Token</label>
                        

                        <div class="flex flex-row">

                            <GenericDropdown
                              v-bind:optionList="currencyTokensOptionsList" 
                              v-bind:onSelectCallback="onCurrencySelectCallback"
                            />
                          
                        </div>


                    </div>



                    <GenericTable
                        v-bind:labelsArray="['currencyType','bidAmount','expires']"
                        v-bind:rowsArray="formattedBidsArray"
                        v-bind:clickedRowCallback="clickedBidRowCallback"
                    />

                </div>

                 <div v-if="selectedBidPacket" class="text-xs">
                   <div class=" ">
                    <div class="text-lg mt-4 font-bold inline-block">Selected Bid Data </div>

                    <div @click="resetBid()" class="p-1 mx-4 rounded text-xs select-none cursor-pointer bg-purple-500 text-white inline-block"> Select a Different Bid </div>
                  </div>
                  <div> bidder: {{selectedBidPacket.bidderAddress}}</div>
                  <div> nftContractName: {{selectedBidPacket.nftContractName}}</div>
                  <div> nftContractAddress: {{selectedBidPacket.nftContractAddress}}</div>
                  <div v-if="selectedBidPacket.requireProjectId"> projectId: {{selectedBidPacket.projectId}}</div>
                  <div> currencyTokenName: {{selectedBidPacket.currencyTokenName}}</div>
                  <div> currencyTokenAddress: {{selectedBidPacket.currencyTokenAddress}}</div>
 


                  <div> currencyTokenAmount: {{selectedBidPacket.currencyTokenAmountFormatted}}</div>
                  <div> currencyTokenAmountRaw: {{selectedBidPacket.currencyTokenAmount}}</div>
                  <div> expires:  {{selectedBidPacket.expires}}</div> 
                  <div> signature:  {{selectedBidPacket.signature}}</div> 

                  <div v-if="this.selectedBidBurnStatus && this.selectedBidBurnStatus > 0" class="bg-red-200 p-1"> WARN: This bid signature has been burned. </div>


                  <div class="  p-4" v-if="!hasGivenApprovalForSelectedToken()">
                     <div @click="approveNFT()" class="select-none bg-teal-300 p-2 inline-block rounded border-black border-2 cursor-pointer"> Approve NFT </div>
                 </div>

                 


                   <div class="  p-4">
                     <div @click="sellToBid()" class="select-none bg-teal-300 p-2 inline-block rounded border-black border-2 cursor-pointer"> Sell to this bid </div>
                 </div>

                </div>





          </div>

       
  </div>
</template>


<script>
 
 
import GenericTable from './GenericTable.vue';
import GenericDropdown from './GenericDropdown.vue';
import NFTGallery from './NFTGallery.vue';

import NotConnectedToWeb3 from './NotConnectedToWeb3.vue'


import BidPacketHelper from '../../js/bidpacket-helper.js'
import BidPacketUtils from '../../js/bidpacket-utils.js'

import BuyTheFloorHelper from '../../js/buythefloor-helper.js'

import NFTHelper from '../../js/nft-helper.js'



var BTFContractABI = require('../../contracts/BuyTheFloorABI_2.json')

 

var updateApprovalsInterval;
 
export default {
  name: 'NFTSellForm',
  props: ['nftContractAddress', 'projectId', 'web3Plug', 'connectedToWeb3'],
  components:{GenericTable,GenericDropdown,NFTGallery,NotConnectedToWeb3},
  data() {
    return {

        filterByCurrencyAddress: null,

        nftTokenIdToSell: null,
        ownedTokenIdToSell: null,
        ownerOfSelectedToken: null,
        hasApprovedSelectedTokenForBTF: false,

       formattedBidsArray: [] , 
       selectedBidPacket:null,

        

       currencyTokensOptionsList: []  
    }
  },
  created(){

      this.resetForm()
 

      this.fetchRelevantBids()

      updateApprovalsInterval = setInterval(this.updateApproval, 5000)

      let activeNetworkId = this.web3Plug.getActiveNetId()

      let currencyOptions = BuyTheFloorHelper.getClientConfigForNetworkId(activeNetworkId).currencyTokens 
     

      this.currencyTokensOptionsList=[{'name':null,'label':'all'} ].concat( currencyOptions );
          
  },
  beforeDestroy(){
      clearInterval( updateApprovalsInterval )


  },
  methods: {
        async fetchRelevantBids(){

             let chainId = this.web3Plug.getActiveNetId()
            if(!chainId){
              chainId = 1
            }


             let contractData = this.web3Plug.getContractDataForNetworkID(chainId) 
             let btfContractAddress = contractData['buythefloor'].address


            var hostname = window.location.hostname; 

                 
            let serverURL = BuyTheFloorHelper.getSocketURL(this.web3Plug.getActiveNetId())
            console.log('serverURL',serverURL)

    

            let queryParams = {nftContractAddress: this.nftContractAddress, 
                        exchangeContractAddress: btfContractAddress ,
                        projectId: this.projectId,
                        status:'active',
                        suspended:false 
                        }

            //queryParams = {}

            if(this.filterByCurrencyAddress){
              queryParams.currencyTokenAddress = this.filterByCurrencyAddress
            }


            let bidPackets = await BidPacketHelper.getBidPackets(serverURL,queryParams )
            console.log('bidPackets',bidPackets)



            if(this.web3Plug.connectedToWeb3()){
              let ethBlockNumber = await this.web3Plug.getBlockNumber()

             
               bidPackets = bidPackets.filter( (bid) => {
                                return (bid.expires == 0 || bid.expires > ethBlockNumber)
                              } )
            }
           



            /*bidPackets = bidPackets.filter( (bid) => {
              return (bid.status == 'active')
            } )


              bidPackets = bidPackets.filter( (bid) => {
              return (bid.exchangeContractAddress == btfContractAddress.toLowerCase())
            } )

            
            for(let bid of bidPackets){
                  this.rawBidsArray[bid.signature.signature] = bid
            }*/

            

            

            this.formattedBidsArray = bidPackets.map(pkt => (
                                                           {
                                                           
                                                            currencyTokenName: BuyTheFloorHelper.getNameFromContractAddress(pkt.currencyTokenAddress,0, chainId),
                                                            currencyTokenAmountFormatted: BuyTheFloorHelper.getFormattedCurrencyAmount(pkt.currencyTokenAmount,pkt.currencyTokenAddress, chainId),
                                                            expires: pkt.expires,
                                                           
                                                            signature: pkt.signature.signature,

                                                            nftContractName: BuyTheFloorHelper.getNameFromContractAddress(pkt.nftContractAddress,pkt.projectId, chainId),
                                                            nftContractAddress: pkt.nftContractAddress,
                                                            requireProjectId: pkt.requireProjectId,
                                                            projectId: pkt.projectId,
                                                            currencyTokenAddress: pkt.currencyTokenAddress,
                                                            currencyTokenAmount: pkt.currencyTokenAmount,
                                                            bidderAddress: pkt.bidderAddress
                                                          } 
                                                        ))

            this.formattedBidsArray.sort(function(a, b) {
              return b.currencyTokenAmount - a.currencyTokenAmount;
            })

        },
       async selectTokenIdToSell(){
         this.ownedTokenIdToSell = this.nftTokenIdToSell


         this.ownerOfSelectedToken = await NFTHelper.getOwnerOfNFT( this.nftContractAddress  ,this.nftTokenIdToSell, this.web3Plug)
       
         this.projectIdOfSelectedToken = await NFTHelper.getProjectIdOfNFT( this.nftContractAddress  ,this.nftTokenIdToSell, this.web3Plug)

          this.projectIdOfSelectedToken = parseInt(this.projectIdOfSelectedToken)
          if(isNaN(this.projectIdOfSelectedToken))this.projectIdOfSelectedToken=0;

         this.hasApprovedSelectedTokenForBTF = await NFTHelper.hasGivenApprovalofNFTForBTF( this.nftContractAddress ,  this.web3Plug)
       },

        async updateApproval(){
            this.hasApprovedSelectedTokenForBTF = await NFTHelper.hasGivenApprovalofNFTForBTF( this.nftContractAddress ,  this.web3Plug)
     
        },


        setPredefinedTokenId(tokenId){
          console.log('setPredefinedTokenId',tokenId)
          this.nftTokenIdToSell = tokenId
        },

        resetForm(){
         this.ownedTokenIdToSell = null
         this.selectedBidPacket = null 
       },
       async clickedBidRowCallback(row){
         console.log('clicked bid row', row)


          this.selectedBidPacket = row  

          this.selectedBidBurnStatus = await BidPacketUtils.getPacketBurnStatus( row, BTFContractABI, this.web3Plug )

           console.log('this.selectedBidPacket', this.selectedBidPacket)
       },
       resetBid(){
         this.selectedBidPacket = null
       },

       async approveNFT(){


           let response = await NFTHelper.approveNFTTypeToBuyTheFloor( this.selectedBidPacket.nftContractAddress, this.web3Plug)

       },

       async sellToBid(){
         console.log('sell to bid ', this.ownedTokenIdToSell, this.selectedBidPacket)

         let sellParams = {
          
          nftTokenAddress: this.nftContractAddress,
          tokenId: this.ownedTokenIdToSell, 
          from: this.web3Plug.getActiveAccountAddress(),
          to:  this.selectedBidPacket.bidderAddress,
          currencyToken: this.selectedBidPacket.currencyTokenAddress,
          currencyAmount: this.selectedBidPacket.currencyTokenAmount,
          requireProjectId: this.selectedBidPacket.requireProjectId,
          projectId: this.selectedBidPacket.projectId,
          expires: this.selectedBidPacket.expires,
          buyerSignature: this.selectedBidPacket.signature


         }

          console.log('sellParams ', sellParams)


         let response = await BidPacketUtils.sellNFTToBid( sellParams, BTFContractABI , this.web3Plug)

         console.log(response)
       },


       isTheOwnerOfSelectedToken(){
         if(!this.ownerOfSelectedToken){
           return false 
         }
         return (this.ownerOfSelectedToken.toLowerCase() == this.web3Plug.getActiveAccountAddress().toLowerCase())
       },
        hasGivenApprovalForSelectedToken(){
         return  this.hasApprovedSelectedTokenForBTF  
       },
       onCurrencySelectCallback(selectedCurrency){
          

         let currencyName = selectedCurrency.name 

          let chainId = this.web3Plug.getActiveNetId()
            if(!chainId) chainId = 1;


         let contractData = this.web3Plug.getContractDataForNetworkID(chainId)

         if(contractData[currencyName]){
            let currencyAddress = contractData[currencyName].address

             this.filterByCurrencyAddress = currencyAddress
         }else{
           this.filterByCurrencyAddress = null
         }
         
         this.fetchRelevantBids()
       }
  }
}
</script>
