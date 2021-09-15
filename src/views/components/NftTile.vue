<template>
  <a v-bind:href="getLinkUrl()" class=" cursor-pointer select-none inline-block m-4 relative"   >

    <img v-bind:src="getImageURL()" width="128" height="128" />

  </a>
</template>


<script>


export default {
  name: 'NftTile',
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
