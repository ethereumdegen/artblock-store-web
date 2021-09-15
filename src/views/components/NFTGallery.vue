<template>
  <div class=" ">
      
     <div> Your NFTs: </div> 

  <div>
    
    <div v-for="tokenData of ownedTokenIdsArray" class="m-4 p-2 inline-block border-2 border-black">
         

 
        <div>   {{tokenData.typeName}}  </div> 

        <div class="text-xs"> Id: {{tokenData.tokenId}}  </div> 

        <div v-if="tokenData.needsWrap">(Must be wrapped to sell)</div>


         <router-link class="text-xs p-1 bg-blue-500 no-underline rounded text-white" v-bind:to="getLinkToSellToken(tokenData)">  Sell this NFT  </router-link> 
    </div>

    <div v-if="ownedTokenIdsArray.length ==0">
      No results found.
    </div>
    
  </div>
       
  </div>
</template>


<script>

//use THE GRAPH 

import web3utils from 'web3-utils'

import TheGraphHelper from '../../js/the-graph-helper.js'
import StarflaskAPIHelper from '../../js/starflask-api-helper.js'

import NFTHelper from '../../js/nft-helper.js'

import BuyTheFloorHelper from '../../js/buythefloor-helper.js'

export default {
  name: 'NFTGallery',
  props: ['nftContractAddress', 'projectId', 'web3Plug'],
  data() {
    return {
      nftType: null,
      ownedTokenIdsArray: [] 
    }
  },
  /* watch: {
    nftContractAddress: function (contractAddress) {
       this.nftType = BuyTheFloorHelper.getNameFromContractAddress(this.nftContractAddress, this.projectId, this.web3Plug.getActiveNetId())
        
         this.fetchOwnedTokenIds()
    } ,
    projectId: function (projectId) {
       this.nftType = BuyTheFloorHelper.getNameFromContractAddress(this.nftContractAddress, this.projectId, this.web3Plug.getActiveNetId())
        
         this.fetchOwnedTokenIds()
    } 
  },*/
  mounted(){

      
      /*if(this.nftContractAddress && this.projectId){
        this.nftType = BuyTheFloorHelper.getNameFromContractAddress(this.nftContractAddress, this.projectId, this.web3Plug.getActiveNetId())
      
      }*/
      

      this.fetchOwnedTokenIds()


  },
  methods: {
       async fetchOwnedTokenIds(){
          console.log('nftContractAddress', this.nftContractAddress)
          console.log('nftType', this.nftType)

          


          let activeAddress = this.web3Plug.getActiveAccountAddress()

          let chainId = this.web3Plug.getActiveNetId()
 
/*
        if(this.nftType.toLowerCase() == 'cryptovoxelsparcels'){
          let nftDataArray = await TheGraphHelper.findCryptovoxelsOwnedBy( activeAddress )
       
          this.ownedTokenIdsArray = nftDataArray
        }


         if(this.nftType.toLowerCase() == 'wrappedmooncats'){
          let nftDataArray = await TheGraphHelper.findMooncatsOwnedBy( activeAddress )
       
          this.ownedTokenIdsArray = nftDataArray
        }

          if(this.nftType.toLowerCase() == 'wrappedcryptopunks'){ 
          let nftDataArray = await TheGraphHelper.findWrappedPunksOwnedBy( activeAddress )
       
          this.ownedTokenIdsArray = nftDataArray
        }


         if(this.nftType.toLowerCase() == 'hashmasks'){ 
          let nftDataArray = await TheGraphHelper.findHashmasksOwnedBy( activeAddress )
       
          this.ownedTokenIdsArray = nftDataArray
        }*/



            //fetch nft data from starflask 

          let nftArrayResult = await this.fetchOwnedAssets(activeAddress)
          console.log('nftArrayResult',nftArrayResult)

           this.ownedTokenIdsArray = []

          if(nftArrayResult.success == true){
            let nftContractsArray = nftArrayResult.output 

            for(let nftContractData of nftContractsArray){

              for(let tokenId of nftContractData.tokenIds){

                 let projectId = BuyTheFloorHelper.getProjectIdFromTokenId(tokenId)

                 let canBeSold = BuyTheFloorHelper.contractAddressAssetCanBeSold(nftContractData.contractAddress,projectId, chainId)

                 if(!canBeSold)continue;  

                 let nftTypeName = BuyTheFloorHelper.getNameFromContractAddress(nftContractData.contractAddress,projectId, chainId )

                this.ownedTokenIdsArray.push({
                  contractAddress: web3utils.toChecksumAddress( nftContractData.contractAddress ),
                  typeName: nftTypeName,
                  tokenId: tokenId

                })
              }

            }

           
          }

          

         if(this.nftContractAddress  ){

           let nftContractAddress = web3utils.toChecksumAddress(this.nftContractAddress)
         // this.nftType = BuyTheFloorHelper.getNameFromContractAddress(this.nftContractAddress, this.projectId, this.web3Plug.getActiveNetId())
              
              //filter them !
             this.ownedTokenIdsArray =  this.ownedTokenIdsArray.filter(item => (item.contractAddress == nftContractAddress))
           
          }
          



           
          console.log('nftDataArray',this.ownedTokenIdsArray)
          
       },

         async fetchOwnedAssets(publicAddress){


            let apiKey = 'testApiKey'

            let apiURI = `https://api.starflask.com/api/v1/${apiKey}`
            let inputData = {requestType: 'all_ERC721', input: { publicAddress: publicAddress  } } 
            let results = await StarflaskAPIHelper.resolveStarflaskQuery(apiURI ,  inputData   )
            console.log(results)
             return results
          },




       getLinkToSellToken(tokenData){

         return '/sell/'.concat(tokenData.typeName).concat('/').concat(tokenData.tokenId)
       }
  }
}
</script>
