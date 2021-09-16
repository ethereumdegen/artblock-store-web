<template>

<div>

   <div class="section  bg-white border-b-2 border-black px-0 lg:px-1">

     <div class=" ">
        <Navbar 
        v-bind:web3Plug="web3Plug"
       />
     </div>


   </div>

  
   <div class="section  bg-white border-b-2 border-black   ">
     <div class=" w-container">
       <div class="w-row">

       </div>
       <div class="w-row">

         


         <div class="column w-col w-col-6 mt-8 py-8">
          <div class="hidden">
            <div class="">              
               <router-link to="/collection/artblocks-curated" class='text-gray-800 text-xl block'> Artblocks Curated </router-link>
              </div>

            <div class="">              
               <router-link to="/collection/artblocks-factory" class='text-gray-800 text-xl block'> Artblocks Factory </router-link>
              </div>

            <div class="">              
               <router-link to="/collection/artblocks-playground" class='text-gray-800 text-xl block'> Artblocks Playground </router-link>
              </div>
           </div>


            <div >

              <div> Top Projects </div>


             <div class="" v-for="item in primaryListItems" v-bind:key="item.projectId">              
               <router-link :to="'/project/'+item.projectId" class='text-gray-800 text-xl block'> {{ item.name}}   </router-link>
              </div>
             

           
           </div>
 

         </div>






         <div class="column-2 w-col w-col-6  ">
           
              <FrontPageMedia />

             



         </div>
       </div>
     </div>
   </div>


   <div class="section  bg-white border-b-2 border-black hidden ">
     <div class=" w-container">
       <div class="w-row">

       </div>
       <div class="w-row">

         


         <div class="column w-col w-col-6 mt-8 py-8">

            <div>
               <SearchBar  v-bind:onSubmitCallback="onSearchCallback"  /> 
            </div>

              <router-link to="/newbid" class='text-gray-800 text-xl block'>-> Place a Bid for an NFT</router-link>
 

               <router-link to="/startselling" class='text-gray-800 text-xl block'>-> View and Sell your NFTs</router-link>
            <br>
           
           <br>

      


         </div>
         <div class="column-2 w-col w-col-6  ">
           
              <FrontPageMedia />

             



         </div>
       </div>
     </div>
   </div>


  <div class="section  bg-white border-b-2 border-black hidden ">
     <div class="w-container pt-8">

        <div class="column w-col w-col-6 mb-8 py-8">
        
          <a href="https://www.youtube.com/watch?v=qI0GOvnX1qM" target="_blank" class="border-black border-2 inline-block p-2 rounded no-underline text-black hover:bg-gray-400">
            <svg class="svg-icon inline " style="  " viewBox="0 0 20 20">
                  <path fill="none" d="M9.426,7.625h0.271c0.596,0,1.079-0.48,1.079-1.073V4.808c0-0.593-0.483-1.073-1.079-1.073H9.426c-0.597,0-1.079,0.48-1.079,1.073v1.745C8.347,7.145,8.83,7.625,9.426,7.625 M9.156,4.741c0-0.222,0.182-0.402,0.404-0.402c0.225,0,0.405,0.18,0.405,0.402V6.62c0,0.222-0.181,0.402-0.405,0.402c-0.223,0-0.404-0.181-0.404-0.402V4.741z M12.126,7.625c0.539,0,1.013-0.47,1.013-0.47v0.403h0.81V3.735h-0.81v2.952c0,0-0.271,0.335-0.54,0.335c-0.271,0-0.271-0.202-0.271-0.202V3.735h-0.81v3.354C11.519,7.089,11.586,7.625,12.126,7.625 M6.254,7.559H7.2v-2.08l1.079-2.952H7.401L6.727,4.473L6.052,2.527H5.107l1.146,2.952V7.559z M11.586,12.003c-0.175,0-0.312,0.104-0.405,0.204v2.706c0.086,0.091,0.213,0.18,0.405,0.18c0.405,0,0.405-0.451,0.405-0.451v-2.188C11.991,12.453,11.924,12.003,11.586,12.003 M14.961,8.463c0,0-2.477-0.129-4.961-0.129c-2.475,0-4.96,0.129-4.96,0.129c-1.119,0-2.025,0.864-2.025,1.93c0,0-0.203,1.252-0.203,2.511c0,1.252,0.203,2.51,0.203,2.51c0,1.066,0.906,1.931,2.025,1.931c0,0,2.438,0.129,4.96,0.129c2.437,0,4.961-0.129,4.961-0.129c1.117,0,2.024-0.864,2.024-1.931c0,0,0.202-1.268,0.202-2.51c0-1.268-0.202-2.511-0.202-2.511C16.985,9.328,16.078,8.463,14.961,8.463 M7.065,10.651H6.052v5.085H5.107v-5.085H4.095V9.814h2.97V10.651z M9.628,15.736h-0.81v-0.386c0,0-0.472,0.45-1.012,0.45c-0.54,0-0.606-0.515-0.606-0.515v-3.991h0.809v3.733c0,0,0,0.193,0.271,0.193c0.27,0,0.54-0.322,0.54-0.322v-3.604h0.81V15.736z M12.801,14.771c0,0,0,1.03-0.742,1.03c-0.455,0-0.73-0.241-0.878-0.429v0.364h-0.876V9.814h0.876v1.92c0.135-0.142,0.464-0.439,0.878-0.439c0.54,0,0.742,0.45,0.742,1.03V14.771z M15.973,12.39v1.287h-1.688v0.965c0,0,0,0.451,0.405,0.451s0.405-0.451,0.405-0.451v-0.45h0.877v0.708c0,0-0.136,0.901-1.215,0.901c-1.08,0-1.282-0.901-1.282-0.901v-2.51c0,0,0-1.095,1.282-1.095S15.973,12.39,15.973,12.39 M14.69,12.003c-0.405,0-0.405,0.45-0.405,0.45v0.579h0.811v-0.579C15.096,12.453,15.096,12.003,14.69,12.003"></path>
                </svg>

              BuyTheFloor Intro Video
        </a> 

        </div>
        

         <div class="column w-col w-col-6 mb-8 py-8">

      <router-link to="/dashboard" class='text-gray-800 text-xl block'>-> View your active bids</router-link>


    

    </div>
        
      </div>
    </div>

    <div class="section  bg-white border-b-2 border-black hidden ">
     <div class="w-container pt-8">

         

        

       <div>
            <TabsBar
                v-bind:tabArray="[{id:'Bids',label:'Recent Bids'},{id:'Sales',label:'Recent Sales'} ]"
                v-bind:onTabSelect="onTabSelect" 
            />
          </div>
        <div>

          <div v-if="selectedTab=='bids'" class="mb-4 ">


              <div class="mb-4">
                        <label class="hidden block text-md font-medium font-bold text-gray-800  ">Filter by NFT Type</label>
                        

                        <div class="flex flex-row">

                            <GenericDropdown
                              v-bind:optionList="nftContractOptionsList" 
                              v-bind:onSelectCallback="onNFTContractSelectCallback"
                            />
                          
                        </div>


               </div>




              <GenericTable
                v-bind:labelsArray="['nftType','currencyType','bidAmount','expires']"
                v-bind:rowsArray="bidRowsArray"
                v-bind:clickedRowCallback="clickedBidRowCallback"
               />

          </div>

           <div v-if="selectedTab=='sales'" class="mb-4   ">


              <GenericTable
                v-bind:labelsArray="['blockNumber','nftType','currencyType','bidAmount' ]"
                v-bind:rowsArray="salesRowsArray"
                v-bind:clickedRowCallback="clickedSalesRowCallback"
               />

           </div> 



        </div>



     </div>
   </div>



    
  <Footer/>

</div>
</template>


<script>



import Web3Plug from '../js/web3-plug.js' 


import SearchBar from './components/legacy/SearchBar.vue';
import Navbar from './components/Navbar.vue';
 
import Footer from './components/Footer.vue';
import TabsBar from './components/TabsBar.vue';
import GenericTable from './components/GenericTable.vue';
import GenericDropdown from './components/GenericDropdown.vue';
import FrontPageMedia from './components/FrontPageMedia.vue';

import BidPacketHelper from '../js/bidpacket-helper.js'


import BuyTheFloorHelper from '../js/buythefloor-helper.js'
import TheGraphHelper from '../js/the-graph-helper.js';

export default {
  name: 'Home',
  props: [],
  components: {Navbar, Footer, TabsBar, GenericTable, GenericDropdown,FrontPageMedia,SearchBar},
  data() {
    return {
      web3Plug: new Web3Plug() ,
      activePanelId: null,
      selectedTab:"bids",
      bidRowsArray:[],
      salesRowsArray: [], 
      nftContractOptionsList: [] ,
      filterByNFTContractAddress: null,

      primaryListItems: [
        {projectId: 0, name:'Chromie Squiggles'},
        {projectId: 1, name:'Genesis'},
        {projectId: 2, name:'Construction Token'},
        {projectId: 7, name:'Elevated Deconstructions'},
        {projectId: 8, name:'Singularity'},
        {projectId: 9, name:'Ignition'},
        {projectId: 10, name:'NimBuds'},
        {projectId: 11, name:'HyperHash'},
        {projectId: 12, name:'Unigrids'},
        {projectId: 13, name:'Ringers'},
        {projectId: 17, name:'Spectron'},
        {projectId: 23, name:'Archetype'},
        {projectId: 78, name:'Fidenza'},
        {projectId: 89, name:'Dreams'},
        {projectId: 95, name:'CryptoVenetian'},
        {projectId: 112, name:'Alien Clock'},
        {projectId: 119, name:'Ecumenopolis'},
        {projectId: 120, name:'Endless Nameless'},
        {projectId: 128, name:'Pigments'},
        {projectId: 131, name:'Scribbled Boundaries'},
        {projectId: 138, name:'Geometry Runners'},
        {projectId: 143, name:'phase'},
        {projectId: 159, name:'Fragments of an Infinite Field'},


        
      ]

      
    }
  },

  created(){

 
    this.web3Plug.getPlugEventEmitter().on('stateChanged', function(connectionState) {
        console.log('stateChanged',connectionState);
         
        this.activeAccountAddress = connectionState.activeAccountAddress
        this.activeNetworkId = connectionState.activeNetworkId

        
         
         
        this.fetchBidsData()
        this.fetchSalesData()

         
      }.bind(this));
   this.web3Plug.getPlugEventEmitter().on('error', function(errormessage) {
        console.error('error',errormessage);
         
        this.web3error = errormessage
       
      }.bind(this));

      this.web3Plug.reconnectWeb()

         
       
        
      this.fetchBidsData()
      this.fetchSalesData()

  },
  mounted: function () {
    
   
   
  }, 
  methods: {
          setActivePanel(panelId){
              if(panelId == this.activePanelId){
                this.activePanelId = null;
                return 
              }
               this.activePanelId = panelId ;
          },
          onTabSelect(tabname){
            console.log(tabname)

              this.selectedTab = tabname.toLowerCase()


          },
          async fetchBidsData(){

            
             var hostname = window.location.hostname;
             
             let chainId = this.web3Plug.getActiveNetId()

             if(chainId==null){
               chainId = 1 
               console.log('no web3 connection')
             }

              let allNFTTypes = BuyTheFloorHelper.getClientConfigForNetworkId(chainId).nftTypes 
             this.nftContractOptionsList = [{'name':null,'label':'all'} ].concat( allNFTTypes )
     


             let contractData = this.web3Plug.getContractDataForNetworkID(chainId) 
             let btfContractAddress = contractData['buythefloor'].address


             
            let serverURL = BuyTheFloorHelper.getSocketURL(chainId)
            console.log('serverURL',serverURL)

            let query = {exchangeContractAddress: btfContractAddress, status:'active', suspended:false  }

             if(this.filterByNFTContractAddress){
              query.nftContractAddress = this.filterByNFTContractAddress
            }


            let bidPackets = await BidPacketHelper.getBidPackets(serverURL, query)
            console.log('bidPackets',bidPackets)

           /* bidPackets = bidPackets.filter( (bid) => {
              return (bid.status == 'active')
            } )

             bidPackets = bidPackets.filter( (bid) => {
              return (bid.exchangeContractAddress == btfContractAddress.toLowerCase())
            } )*/
            
            
            this.bidRowsArray = bidPackets.map(pkt => (
                                                           {
                                                            nftContractAddress: BuyTheFloorHelper.getNameFromContractAddress(pkt.nftContractAddress,pkt.projectId, chainId),
                                                            
                                                            currencyTokenAddress: BuyTheFloorHelper.getNameFromContractAddress(pkt.currencyTokenAddress, 0, chainId),
                                                            currencyTokenAmount: BuyTheFloorHelper.getFormattedCurrencyAmount(pkt.currencyTokenAmount,pkt.currencyTokenAddress, chainId),
                                                            expires: pkt.expires,

                                                            requireProjectId: pkt.requireProjectId,
                                                            projectId: pkt.projectId,
                                                            signature: pkt.signature.signature
                                                          } 
                                                        ))

             this.bidRowsArray.sort(function(a, b) {
              return b.currencyTokenAmount - a.currencyTokenAmount;
            })
          },

         async fetchSalesData(){

            let chainId =  1
            

              let recentSales = await TheGraphHelper.findBoughtTheFloorHistory()


               this.salesRowsArray = recentSales.map(sale => (
                                                           {
                                                            blockNumber: sale.blockNumber ,
                                                            nftContractAddress: BuyTheFloorHelper.getNameFromContractAddress(sale.nftContractAddress,sale.projectId, chainId),
                                                            
                                                            currencyTokenAddress: BuyTheFloorHelper.getNameFromContractAddress(sale.currencyTokenAddress,0, chainId),
                                                            currencyTokenAmount: BuyTheFloorHelper.getFormattedCurrencyAmount(sale.currencyTokenAmount,sale.currencyTokenAddress, chainId),
                                                            
                                                            //requireProjectId: sale.requireProjectId,
                                                            projectId: sale.projectId,
                                                            txHash: sale.id
                                                          } 
                                                        ))


              console.log('recentSales', this.salesRowsArray)

         },

          clickedBidRowCallback(row){
            console.log('clicked bid row',row )

            this.$router.push({ path: `/bid/${row.signature}` })
          },

          clickedSalesRowCallback(row){
            console.log('clicked sales row',row )


            window.open(this.web3Plug.getExplorerLinkForTxHash(row.txHash, 1  ));
          },

          onNFTContractSelectCallback(nftType){
            let name = nftType.name 

            let chainId = this.web3Plug.getActiveNetId()
            if(!chainId) chainId = 1;

            let contractData = this.web3Plug.getContractDataForNetworkID(chainId)

              if(contractData[name]){
                let contractAddress = contractData[name].address

                this.filterByNFTContractAddress = contractAddress
            }else{
              this.filterByNFTContractAddress = null
            }

            this.fetchBidsData()
             
          },
          onSearchCallback(query){
              this.$router.push({ path: '/search/'.concat( query)  } )
          }

  }
}
</script>
