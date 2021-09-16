import { expect } from 'chai';
 

import MongoInterface from '../../market-api-server/lib/mongo-interface.js'
import WolfpackInterface from '../../market-api-server/lib/wolfpack-interface.js'



import FileHelper from '../../market-api-server/lib/file-helper.js'

import ApiInterface from '../../market-api-server/lib/api-interface.js'

import axios from "axios";

 
import Web3 from 'web3'

import StarflaskApiHelper from '../helpers/starflask-api-helper.js'


let envmode = process.env.NODE_ENV

let serverConfigFile = FileHelper.readJSONFile('./market-api-server/serverconfig.json')
let serverConfig = serverConfigFile[envmode]



console.log('serverConfigFile',serverConfigFile)
 
let mongoInterface = new MongoInterface( serverConfig.dbName ) 

let wolfpackInterface = new WolfpackInterface( envmode )


let web3 = new Web3( serverConfig.web3provider  )

let apiInterface = new ApiInterface(web3,mongoInterface,wolfpackInterface, serverConfig )
 


describe("market server api",   function() {


    it("can query", async function() {
      
      let result = await StarflaskApiHelper.resolveStarflaskQuery( 'http://localhost:3000/api/v1/appkey/', {request:'save_new_order', input:{}  }  )

      console.log('result',result )



    });


});

 
