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
        
        
          <div class="text-xl font-bold mb-8"> Place a new bid </div>


          <div  class=" " v-if="!connectedToWeb3">
              <NotConnectedToWeb3 />
          </div>

          <div id="form  " class=" " v-if="connectedToWeb3">
            
            <div class="mb-4">
                <label   class="block text-md font-medium font-bold text-gray-800  ">NFT Type To Buy The Floor</label>
                
                <GenericDropdown
                  ref="nftOptionList"
                  v-bind:optionList="nftOptionsList" 
                  v-bind:onSelectCallback="onNFTSelectCallback"
                />
            </div>


           


             <div class="mb-4">
                <label   class="block text-md font-medium font-bold text-gray-800  ">Bid Currency Token</label>
                

                <div class="flex flex-row">

                <GenericDropdown
                  v-bind:optionList="currencyTokensOptionsList" 
                  v-bind:onSelectCallback="onCurrencySelectCallback"
                />
                  <div class="mb-4 p-4 ml-8" v-if="formInputs.tokenContractAddress">
                    Balance: {{ getSelectedCurrencyBalanceFormatted() }}
                </div>
                </div>


            </div>

            

              
           <div class="mb-4 ">
              <label   class="block text-md font-medium font-bold text-gray-800  ">Bid Amount</label>

              <div class="flex flex-row">
              <div class="w-1/2 px-4">
                    <input type="number"   v-model="formInputs.tokenBidAmountFormatted"  class="text-gray-900 border-2 border-black font-bold px-4 text-xl focus:ring-indigo-500 focus:border-indigo-500 block w-full py-4 pl-7 pr-12   border-gray-300 rounded-md" placeholder="0.00">
                </div>

                  <div class="w-1/2 px-4" @click="approveCurrencyToken" v-if=" approveButtonVisible()">
                     <div class="select-none bg-teal-300 p-2 inline-block rounded border-black border-2 cursor-pointer"> Approve </div>
                </div>
              </div>
           
            </div>


            <div class="mb-4 ">
              <label   class="block text-md font-medium font-bold text-gray-800  ">Blocks until bid expiration  (~{{getDaysFromBlocks(formInputs.expiresInBlocks)}}  days) </label>

              <div class="flex flex-row">
                  <div class="w-1/2 px-4">
                      <input type="number" v-on:blur="handleExpiresBlur()" v-model="formInputs.expiresInBlocks"  class="text-gray-900 border-2 border-black font-bold px-4 text-xl focus:ring-indigo-500 focus:border-indigo-500 block w-full py-4 pl-7 pr-12   border-gray-300 rounded-md" placeholder="100">
                  </div>

                   
              </div>
           
            </div>



          </div>


          <hr>
          <div class="py-4" v-if=" connectedToWeb3 && !bidSubmitComplete">
             
 

            <div> nftAddress: <a  target="_blank" v-bind:href="web3Plug.getExplorerLinkForAddress(formInputs.nftContractAddress)"> {{formInputs.nftContractAddress}} </a> </div>

            <div v-if="this.formInputs.requireProjectId" > projectId: {{ this.formInputs.projectId }} </div>

            <div> CurrencyAddress: <a  target="_blank" v-bind:href="web3Plug.getExplorerLinkForAddress(formInputs.tokenContractAddress)"> {{formInputs.tokenContractAddress}} </a> </div>

            <div> bidAmount: {{getTokenBidAmountFormatted()}}</div>

            <div class="hidden"> bidAmountRaw: {{getTokenBidAmountRaw()}}</div>

            <div> Decimals: {{this.formInputs.tokenDecimals}}</div>

                 <div class="  p-4">
                     <div @click="signForBid" class="select-none bg-teal-300 p-2 inline-block rounded border-black border-2 cursor-pointer"> Submit New Bid </div>
                </div>


          </div>



            <div id="output" v-if="submittedBidPacketResponse" class="p-4">

                  <div  v-if="submittedBidPacketResponse.success && bidSubmitComplete">

                    <div> Your bid has been submitted successfully! </div>

                    <div>

                      <div class="text-xl font-bold"> Your Bid  </div>
                    <div>  nftContractAddress: <a target="_blank" v-bind:href="web3Plug.getExplorerLinkForAddress(submittedBidPacketResponse.saved.nftContractAddress)"> {{submittedBidPacketResponse.saved.nftContractAddress}} </a></div>
                     <div> currencyTokenAddress: <a target="_blank" v-bind:href="web3Plug.getExplorerLinkForAddress(submittedBidPacketResponse.saved.currencyTokenAddress)"> {{submittedBidPacketResponse.saved.currencyTokenAddress}} </a></div>
                      <div> currencyTokenAmount: {{submittedBidPacketResponse.saved.currencyTokenAmount}}</div>
                      <div> expires:  {{submittedBidPacketResponse.saved.expires}}</div>

                    </div>

                    <div @click="resetForm" class="select-none bg-teal-300 p-2 inline-block rounded border-black border-2 cursor-pointer"> Place another bid </div>
                    <router-link to="/dashboard" class="select-none bg-teal-300 p-2 inline-block rounded border-black border-2 cursor-pointer no-underline text-black mx-2"> View my Bids </router-link>
         

                  </div>

                   <div  v-if="!submittedBidPacketResponse.success && submittedBidPacketResponse.error && bidSubmitComplete">

                      <div class="p-4"> ERROR: {{ submittedBidPacketResponse.error }} </div>


                     <div @click="resetForm" class="select-none bg-teal-300 p-2 inline-block rounded border-black border-2 cursor-pointer"> Place another bid </div>
         


                   </div>

                    <div  v-if="!submittedBidPacketResponse.success && !submittedBidPacketResponse.error && bidSubmitComplete">

                      <div class="p-4"> The server could not be reached. </div>


                     <div @click="resetForm" class="select-none bg-teal-300 p-2 inline-block rounded border-black border-2 cursor-pointer"> Place another bid </div>
         


                   </div>

 
                  


          </div>


        
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

import GenericDropdown from './components/GenericDropdown.vue'

import BidPacketUtils from '../js/bidpacket-utils.js'

import BidPacketHelper from '../js/bidpacket-helper.js'

import BuyTheFloorHelper from '../js/buythefloor-helper.js'


import BigNumber from 'bignumber.js'

import NotConnectedToWeb3 from './components/NotConnectedToWeb3.vue'

var updateTimer;

export default {
  name: 'NewBid',
  props: [ ],
  components: {Navbar, Footer, GenericDropdown,NotConnectedToWeb3},
  data() {
    return {
      web3Plug: new Web3Plug(),
      formInputs: {
        
        tokenContractAddress: null,
        tokenDecimals: 18,

        nftContractAddress: null,
        tokenBidAmountFormatted: 0,
       // expiresAtBlock:0 ,
        expiresInBlocks: 100000,
        
      },

      connectedToWeb3: false,
      currentBlockNumber: 0,

      maxExpiresInBlocks: 250000,
                         
      ApproveAllAmount: "1000000000000000000000000000000",
      tokensApproved:{},
      tokenBalances:{},
      currencyTokensOptionsList:[ ],
      nftOptionsList:[ ],
      submittedBidPacketResponse: null,

      
      bidSubmitComplete: false
    }
  },
  computed: {
     
   
  },
  created(){

    this.web3Plug.getPlugEventEmitter().on('stateChanged', async function(connectionState) {
        console.log('stateChanged',connectionState);
         
        this.activeAccountAddress = connectionState.activeAccountAddress
        this.activeNetworkId = connectionState.activeNetworkId

        this.connectedToWeb3 = this.web3Plug.connectedToWeb3()
        this.currentBlockNumber = await this.web3Plug.getBlockNumber()
         
        if(this.connectedToWeb3){
           this.currencyTokensOptionsList= BuyTheFloorHelper.getClientConfigForNetworkId(this.activeNetworkId).currencyTokens 
           this.nftOptionsList=BuyTheFloorHelper.getClientConfigForNetworkId(this.activeNetworkId).nftTypes 

        }
       
        console.log(' this.currencyTokensOptionsList',  this.currencyTokensOptionsList)

         Vue.nextTick(() => {
              this.autoFillNFTType()
         })

      }.bind(this));
   this.web3Plug.getPlugEventEmitter().on('error', function(errormessage) {
        console.error('error',errormessage);
         
        this.web3error = errormessage
        
      }.bind(this));

     
      
    

  },
  mounted () {
    
    
      this.web3Plug.reconnectWeb()

      updateTimer = setInterval(this.updateBalances.bind(this), 5000);

      
    
  }, 

  beforeDestroy(){
      clearInterval(updateTimer) 
  },
  methods: {

    async autoFillNFTType(){

        if(this.$route.params.nft_type){
            this.selectedNFTType = this.$route.params.nft_type.toLowerCase()
            console.log('this.selectedNFTType',this.selectedNFTType)

            console.log('this.$refs',this.$refs, this.$refs.nftOptionList)
            this.$refs.nftOptionList.selectOptionByName( this.selectedNFTType )
          }

    },
         
         async updateBalances(){
          
          let contractData = this.web3Plug.getContractDataForActiveNetwork()

          let activeAddress = this.web3Plug.getActiveAccountAddress()
          let currencyAddress = this.formInputs.tokenContractAddress

          

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
              let currencyAddress = this.formInputs.tokenContractAddress

              let btfContractAddress = contractData['buythefloor'].address
              let currencyTokenContract = this.web3Plug.getTokenContract(currencyAddress)
             
             console.log('new approve' , btfContractAddress, this.ApproveAllAmount)
              await currencyTokenContract.methods.approve(btfContractAddress, this.ApproveAllAmount ).send({from:activeAddress})

          },

           selectedCurrencyIsApproved() {
 
            return (this.tokensApproved[this.formInputs.tokenContractAddress] >= parseInt(this.getTokenBidAmountRaw()))
          },

          approveButtonVisible() {
 
            return (this.tokensApproved[this.formInputs.tokenContractAddress] == 0)
          },

         async signForBid(){
           console.log('sign for bid')


           let contractData = this.web3Plug.getContractDataForActiveNetwork() 
 
           let btfContractAddress = contractData['buythefloor'].address

           let expiresAtBlock = this.getExpiresAtBlock()
              

           let args = [
              this.web3Plug.getActiveAccountAddress(),
              this.formInputs.nftContractAddress,
              this.formInputs.tokenContractAddress,              
              this.getTokenBidAmountRaw(),
              this.formInputs.requireProjectId, 
              this.formInputs.projectId, 
              expiresAtBlock
             // this.formInputs.expiresAtBlock
           ]

            let signature = await BidPacketUtils.performOffchainSignForBidPacket(args, this.web3Plug)
            

            let packetData = BidPacketUtils.getBidPacket(
              this.web3Plug.getActiveAccountAddress(),
              this.formInputs.nftContractAddress,
              this.formInputs.tokenContractAddress,              
              this.getTokenBidAmountRaw(),
              this.formInputs.requireProjectId, 
              this.formInputs.projectId, 
              expiresAtBlock,
              signature
                )
 
              packetData.exchangeContractAddress = btfContractAddress

             /* let typedData = BidPacketUtils.getBidTypedDataFromParams(this.web3Plug.getActiveNetId(),btfContractAddress,  ...args  )
              let recoveredSigner = BidPacketUtils.recoverBidPacketSigner( typedData ,signature.signature)
                console.log('recoveredSigner', recoveredSigner)

                if( recoveredSigner !=  this.web3Plug.getActiveAccountAddress()  ){
                    console.log('incorrect signer recovered')
                  return 
                }*/

              
                var hostname = window.location.hostname; 

             
                let serverURL =  BuyTheFloorHelper.getSocketURL(this.web3Plug.getActiveNetId())
                console.log('serverURL',serverURL)

              packetData.chainId = this.web3Plug.getActiveNetId()

              let reply = await BidPacketHelper.sendBidPacket(serverURL, packetData);

              console.log('reply')

              this.submittedBidPacketResponse = reply

              this.bidSubmitComplete = true 

         },
        onNFTSelectCallback(optionData){
            

          let contractData = this.web3Plug.getContractDataForActiveNetwork()
          let nftContract = contractData[optionData.name]

          
          this.formInputs.nftContractAddress = nftContract.address
          this.formInputs.projectId = parseInt(nftContract.projectId)  

          if(isNaN(this.formInputs.projectId)){
            this.formInputs.requireProjectId = false;
            this.formInputs.projectId=0;
          }else{
            this.formInputs.requireProjectId = true;
          }
          //this.updateBalances();
        },
        onCurrencySelectCallback(optionData){
           
          let contractData = this.web3Plug.getContractDataForActiveNetwork()

           console.log('contractData',contractData)

          let tokenContract = contractData[optionData.name]
          
         
          this.formInputs.tokenDecimals = tokenContract.decimals
          this.formInputs.tokenContractAddress = tokenContract.address
          
          this.updateBalances();

          //this.restrictBidAmount()

           
        },
        getTokenBidAmountRaw(){
          return this.web3Plug.formattedAmountToRaw( this.formInputs.tokenBidAmountFormatted, this.formInputs.tokenDecimals ) 
        },

         getTokenBidAmountFormatted(){
          return this.web3Plug.rawAmountToFormatted( this.getTokenBidAmountRaw(), this.formInputs.tokenDecimals ) 
        },

        getExpiresAtBlock(){
          return ( parseInt(this.currentBlockNumber) + parseInt(this.formInputs.expiresInBlocks))
        },
        getSelectedCurrencyBalance(){
          return this.tokenBalances[this.formInputs.tokenContractAddress]
        },
         getSelectedCurrencyBalanceFormatted(){
          return this.web3Plug.rawAmountToFormatted( this.getSelectedCurrencyBalance(), this.formInputs.tokenDecimals ) 
        },

        resetForm(){
           this.bidSubmitComplete = false 
        },

        handleExpiresBlur(){
          if(this.formInputs.expiresInBlocks > this.maxExpiresInBlocks){
            this.formInputs.expiresInBlocks = this.maxExpiresInBlocks
          }
        },
       /* restrictBidAmount(){
          if(parseFloat(this.formInputs.tokenBidAmountFormatted) > this.getSelectedCurrencyBalanceFormatted() ){
            this.formInputs.tokenBidAmountFormatted = this.getSelectedCurrencyBalanceFormatted()
          }
        },*/
        getDaysFromBlocks(blocks){
          return parseFloat(blocks / 5760).toFixed(2)
        }
  }
}
</script>
