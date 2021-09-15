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
        
       <div class="w-column">


            <div class="w-row">
               
                   <div class="mb-4">
                          <router-link to="/startselling"  class="px-2 no-underline rounded text-xs select-none inline-block cursor-pointer bg-purple-500 text-white"> < Go Back </router-link>
                    </div>
               



              
            </div>




              <div class="text-lg font-bold"> Sell an NFT </div>
               


         
          <div  class=" "  >




           <div v-if="!connectedToWeb3">

                No web3 connection

            </div>


            <div v-if="connectedToWeb3 && !selectedNFTContractAddress">

                Something went wrong..  

            </div>


          <div v-if="connectedToWeb3 && selectedNFTContractAddress">





            <div class="flex flex-col lg:flex-row">
            

                  

                  <div class="text-md flex-grow  " v-if="typeData"> Selected Type: <a v-bind:href="'/type/'.concat(typeData.name)" > {{selectedNFTType}} </a> </div>
                  



                  <div class="  mt-4 text-center" v-if="typeData">
                    <div class="border-2 border-black p-2 inline-block">
                    <img v-bind:src="typeData.imgurl" width="128" height="128" />
                  </div> 
                 </div>


            </div>

               

               <NFTSellForm
                 ref="nftSellForm"
                v-bind:nftContractAddress="selectedNFTContractAddress"
                v-bind:projectId="selectedNFTProjectId"
                  v-bind:web3Plug="web3Plug"
                  v-bind:connectedToWeb3="connectedToWeb3" 

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

import Vue from 'vue'

import Web3Plug from '../js/web3-plug.js' 


import Navbar from './components/Navbar.vue';
 
import Footer from './components/Footer.vue';

import ArtTypeTile from './components/ArtTypeTile.vue'
import NFTSellForm from './components/NFTSellForm.vue'

import NotConnectedToWeb3 from './components/NotConnectedToWeb3.vue'

import BuyTheFloorHelper from '../js/buythefloor-helper.js'

export default {
  name: 'Sell',
  props: [],
  components: {Navbar, Footer,NotConnectedToWeb3, ArtTypeTile, NFTSellForm},
  data() {
    return {
      web3Plug: new Web3Plug() ,
      nftTypes:  [],
      connectedToWeb3: false,
      selectedNFTType: null,
      selectedNFTContractAddress:null ,
      selectedNFTProjectId:null ,
      typeData: null,
      predefinedTokenId: null
    }
  },
  async created  () {



   


   
    this.web3Plug.getPlugEventEmitter().on('stateChanged', function(connectionState) {
        console.log('stateChanged',connectionState);
         
        this.activeAccountAddress = this.web3Plug.getActiveAccountAddress()//connectionState.activeAccountAddress
        this.activeNetworkId = this.web3Plug.getActiveNetId()//connectionState.activeNetworkId
      
        console.log('connected to web3')
        this.connectedToWeb3 = this.web3Plug.connectedToWeb3()
        this.nftTypes = BuyTheFloorHelper.getClientConfigForNetworkId(this.web3Plug.getActiveNetId()).nftTypes


        let chainId = this.activeNetworkId
        if(!chainId) chainId = 1
        
         this.loadTypeData(chainId)


      }.bind(this));
   this.web3Plug.getPlugEventEmitter().on('error', function(errormessage) {
        console.error('error',errormessage);
         
        this.web3error = errormessage
        
      }.bind(this));

        this.web3Plug.reconnectWeb()
   // await this.web3Plug.reconnectWeb()


    let chainId = this.web3Plug.getActiveNetId()
    if(!chainId){
      chainId = 1
    }

     this.loadTypeData(chainId)
      

  }, 
  async mounted(){


         this.web3Plug.reconnectWeb()


      if( this.$route.params.token_id){
        this.predefinedTokenId = this.$route.params.token_id
      }


    Vue.nextTick(function () {
      if(this.$refs.nftSellForm && this.predefinedTokenId){
        this.$refs.nftSellForm.setPredefinedTokenId( this.predefinedTokenId )
      }
    
    }.bind(this))
        
   

  },
  beforeDestroy(){
    this.web3Plug.clearEventEmitter()
  },
  methods: {


        loadTypeData(chainId){
           this.nftTypes = BuyTheFloorHelper.getClientConfigForNetworkId(chainId).nftTypes
          let contractData = this.web3Plug.getContractDataForNetworkID(chainId)

          if(!this.$route.params.nft_type) return

            this.selectedNFTType = this.$route.params.nft_type.toLowerCase()
            if(contractData[this.selectedNFTType]){
              this.selectedNFTContractAddress =  contractData[this.selectedNFTType].address
              this.selectedNFTProjectId =  contractData[this.selectedNFTType].projectId 

              this.typeData = BuyTheFloorHelper.getNFTTypeDataFromName( this.selectedNFTType , chainId ) 

            }




        },
        /*onTileClicked(name){
          console.log('ontileclicked',name )

           let chainId = this.web3Plug.getActiveNetId()
            if(!chainId){
              chainId = 1
            }

          let contractData = this.web3Plug.getContractDataForNetworkID(chainId)


          this.selectedNFTType = name 
          this.selectedNFTContractAddress = contractData[name].address
          this.selectedNFTProjectId = contractData[name].projectId
        },
        resetNFTType(){

          this.selectedNFTType = null 
          this.selectedNFTContractAddress = null
          this.selectedNFTProjectId = null
        }*/
  }
}
</script>
