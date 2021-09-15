<template>

<div>

   <div class="section  bg-white border-b-2 border-black px-0 lg:px-1">

     <div class=" ">
        <Navbar 
        v-bind:web3Plug="web3Plug"
       />
     </div>


   </div>


    <div class="  pt-2 bg-white ">

      <div class=" w-container flex flex-row"> 

      <div class="flex-grow"></div>
      <div class="flex border-2 border-blue-400 rounded px-2">

        <svg class="svg-icon" viewBox="0 0 20 20">
							<path fill="none" d="M14.467,6.707c-0.34,0.198-0.715,0.342-1.115,0.419c-0.318-0.335-0.775-0.545-1.279-0.545c-0.969,0-1.754,0.773-1.754,1.727c0,0.135,0.015,0.267,0.045,0.394C8.905,8.628,7.612,7.94,6.747,6.896C6.596,7.151,6.509,7.448,6.509,7.764c0,0.599,0.31,1.128,0.78,1.438C7.002,9.192,6.732,9.115,6.495,8.985c0,0.007,0,0.014,0,0.021c0,0.837,0.605,1.535,1.408,1.694c-0.147,0.04-0.302,0.06-0.462,0.06c-0.113,0-0.223-0.011-0.33-0.031c0.223,0.687,0.871,1.186,1.638,1.199c-0.6,0.464-1.356,0.739-2.179,0.739c-0.142,0-0.281-0.007-0.418-0.023c0.777,0.489,1.699,0.775,2.689,0.775c3.228,0,4.991-2.63,4.991-4.913c0-0.075-0.002-0.149-0.004-0.223c0.342-0.244,0.639-0.547,0.875-0.894c-0.316,0.137-0.652,0.23-1.008,0.272C14.057,7.448,14.336,7.11,14.467,6.707 M10,0.594c-5.195,0-9.406,4.211-9.406,9.406c0,5.195,4.211,9.406,9.406,9.406c5.196,0,9.407-4.211,9.407-9.406C19.406,4.805,15.195,0.594,10,0.594 M10,18.552c-4.723,0-8.551-3.829-8.551-8.552S5.277,1.449,10,1.449c4.723,0,8.551,3.829,8.551,8.551S14.723,18.552,10,18.552"></path>
						</svg>
            

        <a v-bind:href="getBidShareLink('twitter')" target="_blank" class="text-blue-500 no-underline" > Share this Bid </a>

         </div>
      </div>

     </div>
  

   <div class="section  bg-white border-b-2 border-black">
     <div class="autospacing w-container p-2">
        
       <div class="w-row text-xs border-2 border-gray-500 rounded">

         <div class=" flex flex-col lg:flex-row "> 
              <div class=" flex-grow  p-2">   
                <div class="text-lg font-bold"> Bid Information </div>
                <div>  bidder: <a  target="_blank" v-bind:href="web3Plug.getExplorerLinkForAddress(bidPacketData.bidderAddress)">  {{bidPacketData.bidderAddress}} </a> </div>
                <div> network: {{ bidPacketData.bidNetworkName }} </div>
                <div> nftType: <a   v-bind:href="'/type/'.concat(bidPacketData.nftContractName)">  {{bidPacketData.nftContractName}}  </a></div>
                <div> bid payment: {{bidPacketData.currencyTokenAmountFormatted}} <a  target="_blank" v-bind:href="web3Plug.getExplorerLinkForAddress(bidPacketData.currencyTokenAddress)"> {{bidPacketData.currencyTokenName}} </a> </div>
                
                <div v-if="bidPacketData.expirationFormatted != null"> expiration:  ~{{bidPacketData.expirationFormatted}} days </div>
                <div> status:  {{bidPacketData.status}}</div>
                <div class="hidden" > suspended:  {{bidPacketData.suspended}}</div>
              </div> 
              <div class="  p-4 flex flex-row">
                <div class="flex-grow"></div>
                <div class=" " v-if="typeData" >   
                      <div class="p-2 border-black border-2 ">
                      <img v-bind:src="typeData.imgurl" width="128" height="128"  /> 
                      </div>
                  </div> 
            
                </div> 
          </div> 

         <div v-cloak class="my-8 bg-red-200 p-2 md:flex md:flex-row" v-if="suspensionAlertVisible()">
           
           <div class=" flex-grow ">

            <div class="font-bold text-lg"> This bid is suspended and inactive. </div>

            <div v-if="!hasSufficientBalance()"> > There is not enough {{bidPacketData.currencyTokenName}} in your account. </div>
            <div v-if="!bidCurrencyIsApproved()"> > There is not enough {{bidPacketData.currencyTokenName}} approved to the BuyTheFloor smart contract. </div>
          </div>
          <div class="  ">

               <div class="w-1/2 px-4" @click="approveCurrencyToken" v-if="!bidCurrencyIsApproved()">
                     <div class="select-none bg-teal-300 p-2 inline-block rounded border-black border-2 cursor-pointer"> Approve </div>
                </div>

             
          </div>


         </div>

           <div class="my-8 p-2">

              <div v-cloak @click="cancelBid()" v-if="userIsOwnerOfBid() && !bidHasBeenBurned()" class="select-none bg-teal-300 p-2 inline-block rounded border-black border-2 cursor-pointer"> Cancel bid </div>
              <a v-cloak v-if="!bidHasBeenBurned()"  v-bind:href='"/sell/".concat(bidPacketData.nftContractName)' class="mx-2 select-none bg-teal-300 p-2 no-underline inline-block rounded border-black border-2 cursor-pointer text-black text-md"> Fulfill this bid </a>
         
        </div>

      </div>
     <div class="w-row text-xs ">


          <div class="my-4"></div>

          <div class="p-2 my-4 bg-blue-400 text-white rounded no-select inline-block cursor-pointer" @click="showAdvanced=!showAdvanced"> Show advanced information </div>

          <div class="overflow-x-auto" v-if="showAdvanced">
          <div class="text-md font-bold  "> Advanced Information </div>

          <div>  bidder: <a  target="_blank" v-bind:href="web3Plug.getExplorerLinkForAddress(bidPacketData.bidderAddress)">  {{bidPacketData.bidderAddress}} </a> </div>
          <div>  nftContractAddress: <a  target="_blank" v-bind:href="web3Plug.getExplorerLinkForAddress(bidPacketData.nftContractAddress)"> {{bidPacketData.nftContractAddress}} </a>  ( {{bidPacketData.nftContractName}} ) </div>
          <div v-if="bidPacketData.requireProjectId">  projectId:    {{bidPacketData.projectId}}   </div>
          <div> currencyTokenAddress: <a  target="_blank" v-bind:href="web3Plug.getExplorerLinkForAddress(bidPacketData.currencyTokenAddress)"> {{bidPacketData.currencyTokenAddress}} </a>  ( {{bidPacketData.currencyTokenName}} ) </div>
            <div> currencyTokenAmount: {{bidPacketData.currencyTokenAmount}}   ( {{bidPacketData.currencyTokenAmountFormatted}} ) </div>
            <div> expires:  {{bidPacketData.expires}} <span v-if="bidPacketData.expirationFormatted != null">( ~{{bidPacketData.expirationFormatted}} days )</span> </div>
             <div> hash:  {{bidPacketData.hash}}</div>

            <div v-if="bidPacketData.signature"> signature:  {{bidPacketData.signature.signature}}</div>
            <div> status:  {{bidPacketData.status}}</div>
             <div > suspended:  {{bidPacketData.suspended}}</div>

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

import BidPacketHelper from '../js/bidpacket-helper.js'

import BidPacketUtils from '../js/bidpacket-utils.js'


import BuyTheFloorHelper from '../js/buythefloor-helper.js'

var StoreContractABI = require('../contracts/BlockStoreABI.json')

 

export default {
  name: 'Bid',
  props: [],
  components: {Navbar, Footer},
  data() {
    return {
      web3Plug: new Web3Plug() ,
      bidPacketData: {} ,

      tokenBalances:{},
      tokensApproved:{},
      currentBlockNumber: null,
      showAdvanced:false,

      typeData: null,

      ApproveAllAmount: "1000000000000000000000000000000",
    }
  },
  created: function () {
    
    this.web3Plug.getPlugEventEmitter().on('stateChanged', function(connectionState) {
        console.log('stateChanged',connectionState);
         
        this.activeAccountAddress = connectionState.activeAccountAddress
        this.activeNetworkId = connectionState.activeNetworkId

         this.fetchPacketData(this.$route.params.signature)

       

      }.bind(this));
   this.web3Plug.getPlugEventEmitter().on('error', function(errormessage) {
        console.error('error',errormessage);
         
        this.web3error = errormessage
        
      }.bind(this));
   
      this.web3Plug.reconnectWeb()

      this.fetchPacketData(this.$route.params.signature)


      setInterval( function(){

        this.fetchPacketData(this.$route.params.signature)


          if(this.web3Plug.connectedToWeb3() && this.userIsOwnerOfBid()){
           this.updateBalances()
         } 

      }.bind(this),8000)

  }, 
   beforeDestroy(){
    this.web3Plug.clearEventEmitter()
  },
  methods: {
     async fetchPacketData(signature){
       console.log('fetch',signature)

        var hostname = window.location.hostname; 

        let chainId = this.web3Plug.getActiveNetId()

        if(chainId==null){
          chainId = 1 
          console.log('no web3 connection')
        } 



        
         
        let serverURL = BuyTheFloorHelper.getSocketURL( chainId )  
        console.log('serverURL',serverURL)

        this.bidPacketData = await BidPacketHelper.findBidPacket(signature, serverURL)
        
        let bidChainId = this.bidPacketData.chainId
        this.bidPacketData.bidNetworkName = this.web3Plug.getWeb3NetworkName(bidChainId)

        if(bidChainId){
          chainId = bidChainId; //interim soln
        }

        let contractData = this.web3Plug.getContractDataForNetworkID(chainId)
        let bidTheFloorAddress = contractData['buythefloor'].address

        let typedData =  BidPacketUtils.getBidTypedDataFromParams( chainId , bidTheFloorAddress, this.bidPacketData.bidderAddress, this.bidPacketData.nftContractAddress, this.bidPacketData.currencyTokenAddress, this.bidPacketData.currencyTokenAmount,  this.bidPacketData.requireProjectId  ,this.bidPacketData.projectId, this.bidPacketData.expires   )
        
        if(chainId == parseInt(bidChainId)){
         this.bidPacketData.hash = BidPacketUtils.getBidTypedDataHash(typedData)
        }
       

        
        this.bidPacketData.nftContractName = BuyTheFloorHelper.getNameFromContractAddress(this.bidPacketData.nftContractAddress, this.bidPacketData.projectId, chainId)
        this.bidPacketData.currencyTokenName = BuyTheFloorHelper.getNameFromContractAddress(this.bidPacketData.currencyTokenAddress, 0, chainId)

             console.log('this.bidPacketData.nftContractName',this.bidPacketData.nftContractName)
        this.typeData = BuyTheFloorHelper.getNFTTypeDataFromName(this.bidPacketData.nftContractName , chainId ) // nftTypes[this.nftTypeName]
        console.log('this.typeData',this.typeData)
        
        this.bidPacketData.currencyTokenAmountFormatted = BuyTheFloorHelper.getFormattedCurrencyAmount( this.bidPacketData.currencyTokenAmount, this.bidPacketData.currencyTokenAddress, chainId)
        

        if(this.web3Plug.connectedToWeb3()){
           
           let currentBlockNumber = await this.web3Plug.getBlockNumber()
           let blockDifference = (this.bidPacketData.expires - parseInt(currentBlockNumber))
           
            

           this.bidPacketData.expirationFormatted = BuyTheFloorHelper.getDaysFromBlocks(blockDifference)
        
        }
       
 

         console.log('fetched',this.bidPacketData)

           if(this.web3Plug.connectedToWeb3() && this.userIsOwnerOfBid()){
           this.updateBalances()
         } 


     },

     async cancelBid(){
         let contractData = this.web3Plug.getContractDataForActiveNetwork()
        let bidTheFloorAddress = contractData['buythefloor'].address

        let btfContract = this.web3Plug.getCustomContract(BTFContractABI,bidTheFloorAddress )
         await btfContract.methods.cancelBid(this.bidPacketData.nftContractAddress, this.bidPacketData.bidderAddress,  this.bidPacketData.currencyTokenAddress, this.bidPacketData.currencyTokenAmount, this.bidPacketData.requireProjectId, this.bidPacketData.projectId,this.bidPacketData.expires,this.bidPacketData.signature.signature ).send({from: this.web3Plug.getActiveAccountAddress()})
     } ,

     userIsOwnerOfBid(){
       return (this.bidPacketData && this.bidPacketData.bidderAddress && this.bidPacketData.bidderAddress.toLowerCase() == this.web3Plug.getActiveAccountAddress())
     },


    hasSufficientBalance() {
 
      return (this.tokenBalances[this.bidPacketData.currencyTokenAddress] >= parseInt(this.bidPacketData.currencyTokenAmount))
    },

     bidCurrencyIsApproved() {
 
      return (this.tokensApproved[this.bidPacketData.currencyTokenAddress] >= parseInt(this.bidPacketData.currencyTokenAmount))
    },

     suspensionAlertVisible() {
 
            return (this.currentBlockNumber && (!this.bidCurrencyIsApproved() || !this.hasSufficientBalance() )&& this.userIsOwnerOfBid() && this.web3Plug.connectedToWeb3())
     },

     bidHasBeenBurned(){
       return this.bidPacketData.status == 'burned'
     },


      async updateBalances(){

        console.log('update balances')
          
          let contractData = this.web3Plug.getContractDataForActiveNetwork()

          let activeAddress = this.web3Plug.getActiveAccountAddress()
          let currencyAddress = this.bidPacketData.currencyTokenAddress

          

          let btfContractAddress = contractData['buythefloor'].address

          console.log('currencyAddress',currencyAddress)
          
          this.tokenBalances[currencyAddress] = await this.web3Plug.getTokenBalance(currencyAddress,activeAddress)
          this.tokensApproved[currencyAddress] = await this.web3Plug.getTokenAllowance(currencyAddress,btfContractAddress,activeAddress)

          this.currentBlockNumber = await this.web3Plug.getBlockNumber()
        

          console.log('approve', this.tokensApproved)
          this.$forceUpdate()
         }, 

      async approveCurrencyToken(){

           let contractData = this.web3Plug.getContractDataForActiveNetwork()

              let activeAddress = this.web3Plug.getActiveAccountAddress()
                let currencyAddress = this.bidPacketData.currencyTokenAddress

              let btfContractAddress = contractData['buythefloor'].address
              let currencyTokenContract = this.web3Plug.getTokenContract(currencyAddress)
             
             console.log('new approve' , btfContractAddress, this.ApproveAllAmount)
              await currencyTokenContract.methods.approve(btfContractAddress, this.ApproveAllAmount ).send({from:activeAddress})


      },


     getBidShareLink(type){

       if(type == 'twitter'){

         let escapedURL = window.location.href;
         let escapedText = "View my bid of "+this.bidPacketData.currencyTokenAmountFormatted 
         + " " + this.bidPacketData.currencyTokenName 
         + " for any "+ this.bidPacketData.nftContractName+ " on BuyTheFloor.com:";

         return "https://twitter.com/intent/tweet?url=" + 
          escape(escapedURL) + "&text=" + escape(escapedText)
 
       }

     }
  }
}
</script>
