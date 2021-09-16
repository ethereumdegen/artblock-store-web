
 
  /*

    Packet status:
    active - normal, works
    suspended - invalid token balance or approval (recoverable)
    expired - expired
    burned - sig has burned 


  */

    import BigNumber from 'bignumber.js' 

import Web3Helper from './web3-helper.js'
import BidPacketUtils from '../../src/js/bidpacket-utils.js'

import FileHelper from './file-helper.js'
import APIHelper from './api-helper.js'

const GLOBAL_RATE_SCALE = 40

const StoreContractABI = FileHelper.readJSONFile('./src/contracts/BlockStoreABI.json')
const ERC20ContractABI = FileHelper.readJSONFile('./src/contracts/ERC20ABI.json')

export default class PacketCustodian  {

    constructor(web3, mongoInterface, wolfpackInterface, serverConfig){
        this.mongoInterface = mongoInterface;
        this.wolfpackInterface = wolfpackInterface;
        this.web3 = web3;
        this.serverConfig = serverConfig

        this.init() 

       
    }

    async init(){
        this.chainId =  this.serverConfig.chainId //await Web3Helper.getNetworkId(this.web3);
        this.blockNumber = await Web3Helper.getBlockNumber(this.web3);
        setInterval(this.updatePackets.bind(this),1000)
        setInterval(this.updateBidders.bind(this),1000)

        this.updateNetData()
        setInterval(this.updateNetData.bind(this),30*1000)
    }

    async updateNetData( ){
        this.blockNumber = await Web3Helper.getBlockNumber(this.web3);
 

        await this.mongoInterface.upsertOne('network_data',{}, {lastUpdated: Date.now() , blockNumber: this.blockNumber, chainId: this.chainId  })
        console.log('update net data ')

    }
    
    async updatePackets( ){
        console.log('updating packets' )

        //let overviewData = await APIHelper.getOverview(this.mongoInterface, this.wolfpackInterface)


        let timeNow = Date.now()


        let contractData = Web3Helper.getContractDataForNetwork(this.chainId)
        let BTFContractAddress = contractData['buythefloor'].address;

        

        let allActivePackets =   await this.mongoInterface.findAll('bidpackets', {status:'active', exchangeContractAddress:BTFContractAddress})

        let RefreshWaitTime = (1 + allActivePackets.length)*1000//*GLOBAL_RATE_SCALE;  

        
        let activePackets = await this.mongoInterface.findAll('bidpackets', {status:'active', exchangeContractAddress:BTFContractAddress, lastRefreshed: { $lt: (timeNow - RefreshWaitTime  ) }   } )

      
        if(activePackets && activePackets.length > 0){
            let nextPacket = activePackets[0]

            this.refreshPacket(nextPacket )
        }


 


    }

    async updateBidders( ){
        console.log('updating bidders') 

        let timeNow = Date.now()
        let ONE_DAY = 1000*60*60*24

        let allActiveBidders =   await this.mongoInterface.findAll('monitored_accounts', {lastRequested: {$gt:timeNow-ONE_DAY }    })

        
        

        let RefreshWaitTime = (1 + allActiveBidders.length)*1000*GLOBAL_RATE_SCALE;  

        

        console.log('RefreshWaitTime - bidders',RefreshWaitTime)

        let activeBidders =   await this.mongoInterface.findAll('monitored_accounts', {lastRequested: {$gt:timeNow-ONE_DAY },lastRefreshed: { $lt: (timeNow - RefreshWaitTime  ) }   })
        let newBidders =   await this.mongoInterface.findAll('monitored_accounts', {lastRequested: {$gt:timeNow-ONE_DAY }, lastRefreshed: null   })
        
        let activeNewBidders = activeBidders.concat( newBidders )

        if(activeNewBidders && activeNewBidders.length > 0){
            let nextBidder = activeNewBidders[0]

            this.refreshAccount(nextBidder)
        }

        
    }

    async refreshPacket(   packet   ){
        let packetId = packet._id

        console.log('refresh packet', packetId)

        let newStatus = 'active'

        let web3 = this.web3 

        var isNowSuspended = false

        let chainId = this.chainId 
        let blockNumber = this.blockNumber
        

        let contractData = Web3Helper.getContractDataForNetwork(chainId)
        let BTFContractAddress = contractData['buythefloor'].address;
         /*var contractVersionNumber = 2

        if(  BTFContractAddress.toLowerCase() == '0xaaa5ddbfd169f8f70c35a8638fe514e3a816f78a'
        ||BTFContractAddress.toLowerCase() == '0x20eb324ab10fb83ebe90a3f5d863068faba10124'  ){
            contractVersionNumber = 1
        }*/


        // ------ Check the hash for burned ----
         

        let typedData = BidPacketUtils.getBidTypedDataFromParams(chainId, BTFContractAddress,packet.bidderAddress, packet.nftContractAddress, packet.currencyTokenAddress, packet.currencyTokenAmount, packet.requireProjectId,packet.projectId,  packet.expires   )
        let packetHash = BidPacketUtils.getBidTypedDataHash( typedData   )
        
        //console.log('packetHash', packetHash)

        let BTFContract = Web3Helper.getCustomContract( BTFContractABI, BTFContractAddress , web3 )

        //let signatureStatus = await BTFContract.methods.burnedSignatures( packetHash ).call()

        let signatureIsBurned = await APIHelper.getSignatureIsBurned( packetHash, this.wolfpackInterface )

        //console.log('signatureStatus', signatureStatus)

        if( signatureIsBurned  ){

            newStatus = 'burned'
        }
        // ------

        // ------ Check buyers approvals and balance ----   

        //let bidCurrencyAmountRaw = packet.currencyTokenAmount
        //let buyerAddress = packet.bidderAddress 


        let tokenDataSynced = false


        let tokenData = await APIHelper.getDataForToken( packet.currencyTokenAddress, this.wolfpackInterface   )
        const ONE_HOUR = 60*60*1000;

        if(tokenData && tokenData.synced && parseInt(tokenData.lastUpdated) >  (Date.now() - ONE_HOUR)){

            let balanceApprovalData = await APIHelper.getUserBalanceApprovalForToken( packet.bidderAddress, packet.currencyTokenAddress, BTFContractAddress, this.wolfpackInterface    )
           // console.log('monitoring bid with synced data ',balanceApprovalData )
            
            tokenDataSynced = true

            if( new BigNumber(balanceApprovalData.balance).isLessThan(parseInt(packet.currencyTokenAmount))  ){
               // console.log('suspending', packet.currencyTokenAmount, balanceApprovalData.balance)
                isNowSuspended = true
            }

            if(  new BigNumber(balanceApprovalData.approved).isLessThan(parseInt(packet.currencyTokenAmount))    ){
             //   console.log('suspending', packet.currencyTokenAmount, balanceApprovalData.approved)
                isNowSuspended = true
                 
            }


            if(!isNowSuspended){
                console.log('found that bid is not suspended using wolfpack data.')
            }



        }else{

            console.log('WARN: tokendata not synced - requesting manual monitoring '  )
            await PacketCustodian.requestMonitorBidderBalance( packet.bidderAddress, packet.currencyTokenAddress  , packet.chainId, this.serverConfig,  this.mongoInterface)

        }
        
        
      

        // ------


        // ------ Check expiration ----   

        if( packet.expires != 0 && packet.expires < this.blockNumber ){
            newStatus = 'expired'
        }

        // ------

        var updates = {
            $set: {  status:newStatus, lastRefreshed: Date.now()  } 
        }

        if(isNowSuspended){
            updates = {
                $set: {  status:newStatus, lastRefreshed: Date.now(), suspended: isNowSuspended  } 
            }
        } 

        if(tokenDataSynced && !isNowSuspended){
            updates = {
                $set: {  status:newStatus, lastRefreshed: Date.now(), suspended: isNowSuspended  } 
            }
        } 

       

        await this.mongoInterface.updateCustomAndFindOne('bidpackets', { _id: packetId }, updates   )

    }


    async refreshAccount( bidderData ){
        //console.log(bidderData)
        
        let balanceApprovalData = this.getBalanceAndApprovalDataForAccount(bidderData.publicAddress, bidderData.currencyTokenAddress, bidderData.currencyTokenChainId).then(async (value) => {
          
        
        
            let activePackets = await this.mongoInterface.findAll('bidpackets', {bidderAddress: bidderData.publicAddress, currencyTokenAddress: bidderData.currencyTokenAddress, status:'active'    } )
        
 
            for(let packet of activePackets){
    
                let isNowSuspended = false 
    
                if(parseInt(packet.currencyTokenAmount) > parseInt(balanceApprovalData.balance) ){
               //     console.log('suspending', packet.currencyTokenAmount, balanceApprovalData.balance)
                    isNowSuspended = true
                }
    
                if(parseInt(packet.currencyTokenAmount) > parseInt(balanceApprovalData.approved) ){
                 //   console.log('suspending', packet.currencyTokenAmount, balanceApprovalData.balance)
                    isNowSuspended = true
                }
    
                let updates = {
                    $set: {  suspended: isNowSuspended  } 
                }
    
                await this.mongoInterface.updateCustomAndFindOne('bidpackets', { _id: packet._id }, updates   )
    
            }

        
        
        })
        .catch((error) => {

            console.error("Could not   getBalanceAndApprovalDataForAccount", error);
 
        })


       
 
        await this.mongoInterface.updateCustomAndFindOne('monitored_accounts', {publicAddress:bidderData.publicAddress,currencyTokenAddress:bidderData.currencyTokenAddress }, { $set: {  lastRefreshed: Date.now() }}  )


    }




    static async requestMonitorBidderBalance(publicAddress, currencyTokenAddress, chainId, serverConfig, mongoInterface){
 
        
        if(chainId && parseInt(chainId) == parseInt(serverConfig.chainId)){
            await mongoInterface.upsertOne('monitored_accounts', {
                publicAddress:publicAddress,
                currencyTokenAddress:currencyTokenAddress  
            }, 
                { publicAddress:publicAddress,
                    currencyTokenAddress:currencyTokenAddress,
                    currencyTokenChainId: chainId,
                    lastRequested: Date.now() } )

        }else{
            console.log('tried to request monitor balance for wrong chainId', chainId, this.chainId)
        }

     }


      async getBalanceAndApprovalDataForAccount( publicAddress, currencyTokenAddress, currencyTokenChainId, mongoInterface){
         


        let chainId = this.chainId 
        let web3 = this.web3

        if(parseInt(chainId) != parseInt(currencyTokenChainId)){
          //  console.log('WARN: Invalid chain id for monitored account ', currencyTokenAddress, currencyTokenChainId)
            return {balance:0,approved:0}
        }

        let contractData = Web3Helper.getContractDataForNetwork(chainId)
 
        let BTFContractAddress = contractData['buythefloor'].address;

        let currencyTokenContract = Web3Helper.getCustomContract( ERC20ContractABI, currencyTokenAddress , web3 )
        
        var bidderBalance = 0


        return new Promise(
            (resolve, reject) => {


         currencyTokenContract.methods.balanceOf(publicAddress).call().then(async (value) => {
                                
                                bidderBalance = 0;


                                let bidderApproval = await currencyTokenContract.methods.allowance(publicAddress,BTFContractAddress).call()
 
                                //console.log('balance', bidderBalance, publicAddress, currencyTokenAddress)
                                resolve ({balance:bidderBalance, approved: bidderApproval })



                            })
                            .catch((error) => {

                                console.error("The Promise is rejected!", error);


                                reject()  
                            })

            }) 


        
    }

}