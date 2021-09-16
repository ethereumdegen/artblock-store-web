
 
import PacketReceiver from './lib/packet-receiver.js'

import FileHelper from './lib/file-helper.js'

import WolfPack from 'wolfpack'

import IndexerBlockStore from './lib/IndexerBlockStore.js' 
  

import Web3 from 'web3'

let envmode = process.env.NODE_ENV


let serverConfigFile = FileHelper.readJSONFile('./market-api-server/serverconfig.json')
let serverConfig = serverConfigFile[envmode]

let dataghostConfigFile = FileHelper.readJSONFile('./market-api-server/dataghostconfig.json')
let dataghostConfig = dataghostConfigFile[envmode]

let BlockStoreABI = FileHelper.readJSONFile('./src/contracts/BlockStoreABI.json')
 
 

  async function start(){

    console.log('dataghost config: ',dataghostConfig)


    
    let web3 = new Web3( serverConfig.web3provider  )
 
    console.log('web3 ready with provider ',serverConfig.web3provider )

   
    let wolfPackConfig = {  
      contracts:dataghostConfig.wolfPackConfig.contracts,
       
      dbName: dataghostConfig.wolfPackConfig.dbName,
      //url: web3Config.dbURI,
      //port: parseInt(web3Config.dbPort),
      indexRate: 10*1000,
      fineBlockGap: dataghostConfig.wolfPackConfig.fineBlockGap,
      courseBlockGap: dataghostConfig.wolfPackConfig.courseBlockGap,
      logging: dataghostConfig.wolfPackConfig.logging,
       
      customIndexers:[{
          type:'BlockStore', 
          abi: BlockStoreABI ,  
          handler: IndexerBlockStore 
       }]
  }



    let wolfPack = new WolfPack()
    await wolfPack.init( {suffix: wolfPackConfig.suffix} )
    wolfPack.startIndexing( web3, wolfPackConfig )  
 
     

} 
 



 
 start()