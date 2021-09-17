<template>
  <div>


     <div class="text-lg font-bold mb-8"> Create Sell Order </div> 


              <div v-if="!hasApprovedAll">


                    
                <div class="my-8 ">

                  <div class="p-2 px-8 border-2 border-black inline cursor-pointer bg-green-400 rounded hover:bg-green-200" @click="approveAllNFT"> Approve All </div>
                </div>


              </div> 


             <div v-if="hasApprovedAll">


                 <div class="mb-4 ">
              <label   class="block text-md font-medium font-bold text-gray-800  ">Buyout Price (ETH)</label>

              <div class="flex flex-row">
                <div class="w-1/2 px-4">
                    <input type="number" v-on:blur="handleAmountBlur()"  v-model="formInputs.currencyAmountFormatted"  class="text-gray-900 border-2 border-black font-bold px-4 text-xl focus:ring-indigo-500 focus:border-indigo-500 block w-full py-4 pl-7 pr-12   border-gray-300 rounded-md" placeholder="0">
                </div>  
              </div>
           
            </div>


           <div class="mb-4 ">
              <label   class="block text-md font-medium font-bold text-gray-800  ">Blocks until offer expiration  (~{{getDaysFromBlocks(formInputs.expiresInBlocks)}}  days) </label>

              <div class="flex flex-row">
                  <div class="w-1/2 px-4">
                      <input type="number"  v-model="formInputs.expiresInBlocks"  class="text-gray-900 border-2 border-black font-bold px-4 text-xl focus:ring-indigo-500 focus:border-indigo-500 block w-full py-4 pl-7 pr-12   border-gray-300 rounded-md" placeholder="10000">
                  </div>

                   
              </div>
           
            </div>




          <div v-if="submittedSellOrderInputs">

             <label> Sell order submitted successfully! </label>

          </div>


           <div v-if="!submittedSellOrderInputs">

              <div class="my-8 " v-if="formInputs.currencyAmountFormatted>0">

              <div class="p-2 px-8 border-2 border-black inline cursor-pointer bg-green-400 rounded hover:bg-green-200" @click="createSellOrder"> Sell </div>
            </div>


          </div>

            

          </div>  

            



  </div>
</template>


<script>

import EIP721Utils from '../../js/EIP712Utils'
import StarflaskAPIHelper from '../../js/starflask-api-helper'


const FrontendConfig = require('../../config/FrontendConfig.json')

const offchainOrderPacketConfig = require('../../js/eip712-config.json')

export default {
  name: 'SellOrderForm',
  props: ['web3Plug','nftContractAddress',  'nftTokenId','orderSubmittedCallback'],
  data() {
    return {
      hasApprovedAll: false,

      submittedSellOrderInputs: null,
      
      formInputs: {

        currencyAmountFormatted: 0,
        expiresInBlocks: 100000
      }
    }
  },
  created(){
    //poll for has approved all 

    this.checkForApproval()

    setInterval(this.checkForApproval,8000);

  },
  methods: {
      
     

       getDaysFromBlocks(blocks){
          return parseFloat(blocks / 5760).toFixed(2)
        },

        getCurrencyAmountRaw(){
          return this.web3Plug.formattedAmountToRaw(this.formInputs.currencyAmountFormatted, 18)
        },


        async checkForApproval(){ 

          let contractData = this.web3Plug.getContractDataForActiveNetwork() ;

          let storeContractAddress = contractData['blockstore'].address
  

          let response = await this.web3Plug.getNFTAllowance(  this.nftContractAddress, storeContractAddress, this.web3Plug.getActiveAccountAddress() )

           
          if(response){
            this.hasApprovedAll = true 
          }

          


        },

        async approveAllNFT(){
          console.log('approve all ')

          let contractData = this.web3Plug.getContractDataForActiveNetwork() ;

          let storeContractAddress = contractData['blockstore'].address
  


          let response = await this.web3Plug.getNFTContract(this.nftContractAddress).methods.setApprovalForAll( storeContractAddress, true ).send( {from: this.web3Plug.getActiveAccountAddress()}  )


        },

        async handleAmountBlur(){
         
         


        },


        async getInputExpirationBlock(){

          let currentBlock = await this.web3Plug.getBlockNumber()
          return currentBlock + parseInt(this.formInputs.expiresInBlocks)
        },



        async createSellOrder(){

          const NATIVE_ETH = "0x0000000000000000000000000000000000000010"


          
          let contractData = this.web3Plug.getContractDataForActiveNetwork() ;

          let storeContractAddress = contractData['blockstore'].address
 
          let inputValues = {
            orderCreator:this.web3Plug.getActiveAccountAddress(),
            isSellOrder:true,
            nftContractAddress:this.nftContractAddress,
            nftTokenId:this.nftTokenId,
            currencyTokenAddress:NATIVE_ETH,
            currencyTokenAmount:this.getCurrencyAmountRaw(),
            expires: await this.getInputExpirationBlock(),



          }

          inputValues.chainId = this.web3Plug.getActiveNetId()
          inputValues.storeContractAddress = storeContractAddress

          let metamaskResponse = await EIP721Utils.performOffchainSignForPacket(
            inputValues.chainId,
            inputValues.storeContractAddress,
            offchainOrderPacketConfig,
            inputValues,
            this.web3Plug.getWeb3Instance(),
            inputValues.orderCreator
            
            )


            //send this to the marketServer with axios post 

            inputValues.signature = metamaskResponse.signature 

            console.log('final input',inputValues)

            console.log('FrontendConfig',FrontendConfig)


            //send this to the marketServer with axios post 
            let result = await StarflaskAPIHelper.resolveStarflaskQuery(
              FrontendConfig.marketApiRoot+'/api/v1/key',
              {requestType:'save_new_order',input: inputValues})

            if(result.success){
              this.submittedSellOrderInputs = inputValues
              this.orderSubmittedCallback()
            }
         


        }

  }
}
</script>
