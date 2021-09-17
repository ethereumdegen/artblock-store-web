


import MongoInterface from './lib/mongo-interface.js'
import WolfpackInterface from './lib/wolfpack-interface.js'



import FileHelper from './lib/file-helper.js'

import ApiInterface from './lib/api-interface.js'

//import PacketReceiver from './lib/packet-receiver.js'
//import PacketCustodian from './lib/packet-custodian.js'

import Web3 from 'web3'

let envmode = process.env.NODE_ENV

let serverConfigFile = FileHelper.readJSONFile('./market-api-server/serverconfig.json')
let serverConfig = serverConfigFile[envmode]

let dataghostConfigFile = FileHelper.readJSONFile('./market-api-server/dataghostconfig.json')
let dataghostConfig = dataghostConfigFile[envmode]

  async function start(){

    console.log('server config: ',serverConfig)


    let mongoInterface = new MongoInterface( serverConfig.dbName ) 


    let wolfpackInterface = new WolfpackInterface( dataghostConfig.wolfPackConfig.dbName )


    let web3 = new Web3( serverConfig.web3provider  )

    //let packetReceiver = new PacketReceiver(web3, mongoInterface, wolfpackInterface, serverConfig)
    
    let apiInterface = new ApiInterface(web3,mongoInterface,wolfpackInterface, serverConfig )
      
    
    console.log('web3 ready with provider ',serverConfig.web3provider )
    

    //add this back in later 
    //let packetCustodian = new PacketCustodian(web3,mongoInterface, wolfpackInterface, serverConfig)



}

 
 start()