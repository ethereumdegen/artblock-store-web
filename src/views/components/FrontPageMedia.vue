<template> 
<div class="pt-8 relative pb-2 mb-12" style="min-height:300px">
            
            
             <img   src="@/assets/images/coins.svg" width="125" height="125" alt="">

             <img v-if="getTimeElapsed() >= 500" class="absolute" style="top:25%; left:10%" src="@/assets/images/0xbitcoinmemes.gif" width="125" height="125" alt="">

             <img v-if="getTimeElapsed() >= 1000" class="absolute" style="top:65%; left:50%" src="@/assets/images/bganpunksV2.gif" width="125" height="125" alt="">
           
             <img v-if="getTimeElapsed() >= 1500" class="absolute" style="top:55%; left:20%" src="@/assets/images/bganpunksV2.jpg" width="125" height="125" alt="">

            <img v-if="getTimeElapsed() >= 2000" class="absolute" style="top:72%; left:30%" src="@/assets/images/cryptopunks.gif" width="125" height="125" alt="">

            <div v-if="getTimeElapsed() >= 2500" class="absolute  text-white text-2xl p-2" style="top:35%; left:30%; background: #222b" > Demand-side NFT Auctions </div>


 </div>
 </template>



<script>
    export default {
    name: 'FrontPageMedia',
    props: [ ],
    data() {
        return {
            startTime: 0
        }
    },
    created(){
        this.startTime= Date.now()

        setInterval(this.update,500)
    },
    methods: {
         update(){
             this.$forceUpdate()
         },
         getTimeElapsed(){
             return Date.now() - this.startTime
         }
    }
    }
</script>
