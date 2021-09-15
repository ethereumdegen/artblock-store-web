
 
import PacketReceiver from './lib/packet-receiver.js'

import FileHelper from './lib/file-helper.js'

import WolfPack from 'wolfpack'
 

import Web3 from 'web3'

let envmode = process.env.NODE_ENV


let serverConfigFile = FileHelper.readJSONFile('./server/serverconfig.json')
let serverConfig = serverConfigFile[envmode]

let dataghostConfigFile = FileHelper.readJSONFile('./server/dataghostconfig.json')
let dataghostConfig = dataghostConfigFile[envmode]

  async function start(){

    console.log('dataghost config: ',dataghostConfig)


    
    let web3 = new Web3( serverConfig.web3provider  )
 
    console.log('web3 ready with provider ',serverConfig.web3provider )

  
    let wolfPackConfig = dataghostConfig.wolfPackConfig


    let wolfPack = new WolfPack()
    await wolfPack.init( {suffix: wolfPackConfig.suffix} )
    wolfPack.startIndexing( web3, wolfPackConfig )  


  
     

} 
 



 
 start()