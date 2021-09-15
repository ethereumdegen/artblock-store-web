<template>
  <div>


     <div class="text-lg font-bold mb-8"> Create Sell Order </div> 


             <div class="mb-4 ">
              <label   class="block text-md font-medium font-bold text-gray-800  ">Buyout Price (ETH)</label>

              <div class="flex flex-row">
                <div class="w-1/2 px-4">
                    <input type="number"   v-model="formInputs.currencyAmountFormatted"  class="text-gray-900 border-2 border-black font-bold px-4 text-xl focus:ring-indigo-500 focus:border-indigo-500 block w-full py-4 pl-7 pr-12   border-gray-300 rounded-md" placeholder="0">
                </div>  
              </div>
           
            </div>


           <div class="mb-4 ">
              <label   class="block text-md font-medium font-bold text-gray-800  ">Blocks until offer expiration  (~{{getDaysFromBlocks(formInputs.expiresInBlocks)}}  days) </label>

              <div class="flex flex-row">
                  <div class="w-1/2 px-4">
                      <input type="number" v-on:blur="handleExpiresBlur()" v-model="formInputs.expiresInBlocks"  class="text-gray-900 border-2 border-black font-bold px-4 text-xl focus:ring-indigo-500 focus:border-indigo-500 block w-full py-4 pl-7 pr-12   border-gray-300 rounded-md" placeholder="10000">
                  </div>

                   
              </div>
           
            </div>


            <div class="my-8 ">

              <div class="p-2 px-8 border-2 border-black inline cursor-pointer bg-green-400 rounded hover:bg-green-200" @click="createSellOrder"> Sell </div>
            </div>



  </div>
</template>


<script>

import EIP721Utils from '../../js/EIP712Utils'

const offchainOrderPacketConfig = require('../../js/eip712-config.json')

export default {
  name: 'SellOrderForm',
  props: ['web3Plug','nftContractAddress',  'nftTokenId'],
  data() {
    return {
      
      formInputs: {

        currencyAmountFormatted: 0,
        expiresInBlocks: 100000
      }
    }
  },
  created(){

  },
  methods: {
      
     

       getDaysFromBlocks(blocks){
          return parseFloat(blocks / 5760).toFixed(2)
        },

        getCurrencyAmountRaw(){
          return this.web3Plug.formattedAmountToRaw(this.currencyTokenAmount, 18)
        },

        async createSellOrder(){

          const NATIVE_ETH = "0x0000000000000000000000000000000000000010"


          console.log('create Sell Order ')

          let contractData = this.web3Plug.getContractDataForActiveNetwork() ;

          let storeContractAddress = contractData['blockstore'].address
 
          let inputValues = {
            orderCreator:this.web3Plug.getActiveAccountAddress(),
            isSellOrder:true,
            nftContractAddress:this.nftContractAddress,
            nftTokenId:this.nftTokenId,
            currencyTokenAddress:NATIVE_ETH,
            currencyTokenAmount:this.getCurrencyAmountRaw(),
            expires:0,



          }

          let result = await EIP721Utils.performOffchainSignForPacket(
            this.web3Plug.getActiveNetId(),
            storeContractAddress,
            offchainOrderPacketConfig,
            inputValues,
            this.web3Plug.getWeb3Instance(),
            this.web3Plug.getActiveAccountAddress()
            
            
            
            )


         


        }

  }
}
</script>
