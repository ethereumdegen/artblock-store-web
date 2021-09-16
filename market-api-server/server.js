


import MongoInterface from './lib/mongo-interface.js'
import WolfpackInterface from './lib/wolfpack-interface.js'

import PacketReceiver from './lib/packet-receiver.js'

import FileHelper from './lib/file-helper.js'

import PacketCustodian from './lib/packet-custodian.js'

import Web3 from 'web3'

let envmode = process.env.NODE_ENV

let serverConfigFile = FileHelper.readJSONFile('./server/serverconfig.json')
let serverConfig = serverConfigFile[envmode]

  async function start(){

    console.log('server config: ',serverConfig)


    let mongoInterface = new MongoInterface( 'bidthefloor_'.concat(envmode) ) 


    let wolfpackInterface = new WolfpackInterface( envmode )


    let web3 = new Web3( serverConfig.web3provider  )

    let packetReceiver = new PacketReceiver(web3, mongoInterface, wolfpackInterface, serverConfig)
 
      
    
    console.log('web3 ready with provider ',serverConfig.web3provider )

    let packetCustodian = new PacketCustodian(web3,mongoInterface, wolfpackInterface, serverConfig)



}

 
 start()