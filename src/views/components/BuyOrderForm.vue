<template>
  <div>


     <div class="text-lg font-bold mb-8"> Place Bid for Item </div> 


              <div class="hidden">


                    
                <div class="my-8 ">

                  <div class="p-2 px-8 border-2 border-black inline cursor-pointer bg-green-400 rounded hover:bg-green-200" @click="approveAllWeth"> Approve Weth </div>
                </div>


              </div> 


             <div  >

           

           <div class="mb-4 ">
             <div class="flex flex-row">
              <label   class="block text-md font-medium font-bold text-gray-800  ">Bid Price (WETH)</label>
                 <div class="px-2 m-2 text-xs bg-blue-500 text-white rounded inline"> Current Balance: {{ getWethBalanceFormatted() }} </div>
              </div>


              <div class="flex flex-row"> 
                <div class="w-1/2 px-4">
                    <input type="number"   v-on:blur="handleAmountBlur()" v-model="formInputs.currencyAmountFormatted"  class="text-gray-900 border-2 border-black font-bold px-4 text-xl focus:ring-indigo-500 focus:border-indigo-500 block w-full py-4 pl-7 pr-12   border-gray-300 rounded-md" placeholder="0">
                </div>  
              </div>
           
            </div>


           <div class="mb-4 ">
              <label   class="block text-md font-medium font-bold text-gray-800  ">Blocks until offer expiration  (~{{getDaysFromBlocks(formInputs.expiresInBlocks)}}  days) </label>

              <div class="flex flex-row">
                  <div class="w-1/2 px-4">
                      <input type="number"   v-model="formInputs.expiresInBlocks"  class="text-gray-900 border-2 border-black font-bold px-4 text-xl focus:ring-indigo-500 focus:border-indigo-500 block w-full py-4 pl-7 pr-12   border-gray-300 rounded-md" placeholder="10000">
                  </div>

                   
              </div>
           
            </div>


            <div v-if="submittedBidInputs">

                 <label> Bid submitted successfully! </label>


            </div>

             <div v-if="!submittedBidInputs">

                <div class="my-8 " v-if="insufficientBalance">

                    <label> Insufficient funds. </label>
                  </div>


                  <div class="my-8 " v-if="!insufficientBalance">

                    <div v-if="needToApproveMore" class="p-2 px-8 border-2 border-black inline cursor-pointer bg-blue-400 rounded hover:bg-blue-200" @click="approveAllWeth"> Approve Weth </div>
                    <div v-if="!needToApproveMore && getCurrencyAmountRaw()>0 && hasCalculatedApproval" class="p-2 px-8 border-2 border-black inline cursor-pointer bg-green-400 rounded hover:bg-green-200" @click="createBuyOrder"> Place Bid </div>
                  </div>

              
            </div>

          


             </div>  

            



  </div>
</template>


<script>

const maxBidAmount =  "500000000000000000000000" //* Math.pow(10,18)

import EIP721Utils from '../../js/EIP712Utils'
import StarflaskAPIHelper from '../../js/starflask-api-helper'


const FrontendConfig = require('../config/FrontendConfig.json')

const offchainOrderPacketConfig = require('../../js/eip712-config.json')

export default {
  name: 'SellOrderForm',
  props: ['web3Plug','nftContractAddress',  'nftTokenId'],
  data() {
    return {

      needToApproveMore: true,
      insufficientBalance: false,

      hasCalculatedApproval: false,

      submittedBidInputs:null,

      currentWethBalance: 0,
      
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

        async getInputExpirationBlock(){

          let currentBlock = await this.web3Plug.getBlockNumber()
          return currentBlock + parseInt(this.formInputs.expiresInBlocks)
        },


        async checkForApproval(){ 

         //check to see if weth is approved 

          let amountRaw = this.web3Plug.formattedAmountToRaw(this.formInputs.currencyAmountFormatted,18)
         
          this.currentWethBalance = await this.getWethBalance()
          let amountApproved = await this.getApprovedWethAmount()




           if(parseInt(amountRaw) > parseInt(this.currentWethBalance)  ){
               
              this.insufficientBalance = true
 
          }else{
              this.insufficientBalance = false
          } 
          
          
          if(parseInt(amountRaw) > parseInt(amountApproved)  ){
               
              this.needToApproveMore = true

              console.log('need to approve more ')
          }else{
              this.needToApproveMore = false

              if( parseInt(amountRaw)>0 ){
                this.hasCalculatedApproval=true
                console.log('has calculated approval',parseInt(amountRaw))
              }
            
          } 


        },


        getWethBalanceFormatted(){
          let formatted=  this.web3Plug.rawAmountToFormatted(this.currentWethBalance,18)

          return parseFloat(formatted)
        },

        async getWethBalance(){

            let contractData = this.web3Plug.getContractDataForActiveNetwork() ;

            let storeContractAddress = contractData['blockstore'].address
            let wethContractAddress = contractData['weth'].address 

            let amount =  await this.web3Plug.getTokenBalance( wethContractAddress,   this.web3Plug.getActiveAccountAddress()   )

            return amount 
        },

        async getApprovedWethAmount(){

            let contractData = this.web3Plug.getContractDataForActiveNetwork() ;

            let storeContractAddress = contractData['blockstore'].address
            let wethContractAddress = contractData['weth'].address 

            let amount =  await this.web3Plug.getTokenAllowance( wethContractAddress, storeContractAddress, this.web3Plug.getActiveAccountAddress()   )

            return amount 
        },

        async approveAllWeth(){
           console.log('approve all ')

           let contractData = this.web3Plug.getContractDataForActiveNetwork() ;

           let storeContractAddress = contractData['blockstore'].address
           let wethContractAddress = contractData['weth'].address 

           let approvedAmount = maxBidAmount 

           let response = await this.web3Plug.getTokenContract(wethContractAddress).methods.approve( storeContractAddress, approvedAmount ).send( {from: this.web3Plug.getActiveAccountAddress()}  )


        },

        async handleAmountBlur(){
           this.checkForApproval()

        },

        async createBuyOrder(){

          
          console.log('create Buy Order ')

          let contractData = this.web3Plug.getContractDataForActiveNetwork() ;

          let storeContractAddress = contractData['blockstore'].address
          let wethAddress = contractData['weth'].address
  

          let inputValues = {
            orderCreator:this.web3Plug.getActiveAccountAddress(),
            isSellOrder:false,
            nftContractAddress:this.nftContractAddress,
            nftTokenId:this.nftTokenId,
            currencyTokenAddress: wethAddress ,
            currencyTokenAmount:this.getCurrencyAmountRaw(),
            expires:  await this.getInputExpirationBlock(),

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

            
            inputValues.signature = metamaskResponse.signature 

            console.log('final input',inputValues)


            //send this to the marketServer with axios post 
            let result = await StarflaskAPIHelper.resolveStarflaskQuery(
              FrontendConfig.MarketApiRoot+'/api/v1/key',
              {requestType:'save_new_order',input: inputValues})

            if(result.success){
              this.submittedBidInputs = inputValues
              
            }

         


        }

  }
}
</script>
