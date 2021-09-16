<template>
 <div>
     <!--  view pertinent offchain orders .. depending on who you are  --> 
       
         <div class="my-8 ">
              <label   class="block text-md font-medium font-bold text-gray-800  ">Buy Offers</label>
 
         </div>

     
     
     </div> 
</template>


<script>


export default {
  name: 'OffersList',
  props: ['nftContractAddress',  'nftTokenId'],
  data() {
    return {
      
    }
  },
  created(){

  },
  methods: {
      
      getLinkUrl(){

        //return `https://artblocks.io/token/${this.nftTokenId}.png` 
        return `/collection/${this.nftContractAddress}/${this.nftTokenId}` 
      },

      getImageURL(){

        return `https://media.artblocks.io/${this.nftTokenId}.png` 

      }
  }
}
</script>
