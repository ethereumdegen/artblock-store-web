
 
 import express from 'express'
 
 import cors from 'cors'
import fs from 'fs'
import path from 'path'

import  history from 'connect-history-api-fallback'
import  bodyParser from 'body-parser' 
 
import { Server } from "socket.io";

import web3utils from 'web3-utils'

import http from 'http'
import https from 'https'

import APIHelper from './api-helper.js'

import AccessHelper from './access-helper.js'
 import ApplicationManager from './application-manager.js'

export default class APIInterface  {

    constructor(web3, mongoInterface,wolfpackInterface,serverConfig){
        this.mongoInterface = mongoInterface;
        this.wolfpackInterface=wolfpackInterface;
        this.web3 = web3;
        this.serverConfig=serverConfig;

 

        const app = express()

        //var server = http.createServer(app);

        let envmode = process.env.NODE_ENV

        var apiPort = 3000

        if(serverConfig.useHTTPS == true ){
          var server = https.createServer({
            cert: fs.readFileSync('/home/andy/deploy/cert/onsecondary.com.pem'),
            key: fs.readFileSync('/home/andy/deploy/cert/onsecondary.com.key')
          });
          console.log('--using https--')
         
        }else{
          
          var server = http.createServer(app);
        }
        
 
         app.use(cors());

  

        //this.startSocketServer(server)

        this.startWebServer(app, apiPort)



        setInterval( function() { this.monitorOffchainOrders(mongoInterface,wolfpackInterface) }.bind(this) , 4000)
    }


    async startWebServer(app, apiPort){

     /* app.get('/api/v1/:query', async (req, res) => {
         
          
        let response = await APIHelper.handleApiRequest( req , this.mongoInterface )

        res.send(response)
      })*/

       app.use(express.json());


      app.post('/api/v1/:app_id', async (req, res) => {
         
        let appId = req.params['app_id']
        //check API key 


        let appIdResults = await ApplicationManager.validateAppId( appId, this.mongoInterface )

        if( !appIdResults.success && this.serverConfig.requireAuthentication){
          res.send(appIdResults)
          return 
        }

         
        console.log('got api request', req.params , req.body    )

        //this needs to log activity so limits can be checked by validateAppId
        let response = await APIHelper.handleApiRequest( req , appId,  this.wolfpackInterface , this.mongoInterface )

        console.log('sending reply:', response   )

        res.send(response)
      })


/*
      app.post('/generate_access_challenge', async (req, res) => {

        let inputData = req.body 

        let publicAddress = web3utils.toChecksumAddress( inputData.publicAddress  ) 

        let accessChallenge = await AccessHelper.generateAccessChallenge( publicAddress ,this.mongoInterface )

        let response = {success:true , accessChallenge: accessChallenge}

        res.send(response)
      })

      app.post('/generate_access_token', async (req, res) => {

        let inputData = req.body 

        let publicAddress = web3utils.toChecksumAddress( inputData.publicAddress  ) 
        let signature =  inputData.signature  

        let accessToken = await AccessHelper.generateAccessToken( publicAddress , signature,  this.mongoInterface )

        if(accessToken){
          let response = {success:true , accessToken: accessToken}

          res.send(response)
        }else{
          let response = {success: false}

          res.send(response)
        }
     
      })

      app.post('/generate_new_application', async (req, res) => {

        let inputData = req.body   
        let accessToken =  inputData.accessToken   

       

        let accessTokenData = await AccessHelper.findAccessToken( accessToken, this.mongoInterface )

   
        if(accessTokenData &&  accessTokenData.isValid){

          let userPublicAddress = accessTokenData.publicAddress

          let newApplicationResult = await ApplicationManager.generateNewApplicationForUser( userPublicAddress, this.mongoInterface )

          res.send({success:true, result: newApplicationResult} )

          return 
        }

        res.send({success:false } ) 

      })

      app.post('/list_my_applications', async (req, res) => {
 
        let inputData = req.body   
        let accessToken =  inputData.accessToken   

        let accessTokenData = await  AccessHelper.findAccessToken( accessToken , this.mongoInterface)
 
        if(accessTokenData &&  accessTokenData.isValid){
          
          let userPublicAddress = accessTokenData.publicAddress

          let list = await ApplicationManager.findAllApplicationsForUser( userPublicAddress, this.mongoInterface )
         
           
          res.send({success:true, list: list} )
          return
        }

        res.send({success:false } ) 

      })


*/


      /*
      app.get('/api/v1/:apikey/:query', async (req, res) => {
         
          
        let response = await APIHelper.handleApiRequest( req , this.mongoInterface )

        res.send(response)
      })*/



      const staticFileMiddleware = express.static('dist');
      app.use(staticFileMiddleware);
      app.use(history({
        disableDotRule: true,
        verbose: true
      }));
      app.use(staticFileMiddleware);




      app.listen(apiPort, () => {
        console.log(`API Server listening at http://localhost:${apiPort}`)
      })


 

    }

    //mark offchain orders as being  Burned or not 

    //when we see that there is an event that came in that burned an offchain order BUT has not successfully marked all offchain orders in our DB ,
    async monitorOffchainOrders( mongoInterface, wolfpackInterface ){ 

      //console.log('monit')

      //find the next 'burn' event which has not applied its burn to any records in our db 
      let nextUnappliedNonceBurning = await wolfpackInterface.findOne( 'burned_nonces', { hasBeenApplied: false }   )

      if(nextUnappliedNonceBurning){

       // console.log('meep', nextUnappliedNonceBurning.nonce)

        let burnedNonce = nextUnappliedNonceBurning.nonce 


        let updates = await mongoInterface.updateMany('market_orders', { nonce:burnedNonce  }, {hasBeenBurned: true }  )

       

        let numberModified = updates.result.nModified

       // console.log('numberModified',numberModified)
      

        if(numberModified > 1){
           //mark that it has been applied 
            await wolfpackInterface.updateOne( 'burned_nonces', { _id: nextUnappliedNonceBurning._id  } ,{ hasBeenApplied: true }   )
        }

        //await mongoInterface.updateMany('market_orders', { nonce:burnedNonce  }, {hasBeenBurned: false }  )

       
      }
      //make it apply its rcords to the stuff in our db  , and mark it that is has been applied 





    }
 
    

}