 
    import Web3Helper from './web3-helper.js'
    import BidPacketUtils from '../../src/js/bidpacket-utils.js'
    
    import EIP712Utils from '../../src/js/EIP712Utils.js'

    import web3utils from 'web3-utils'
    //import ApplicationManager from './application-manager.js'
    
 
    export default class APIHelper  {
    
        constructor(   ){
           
           
        }

        //http://localhost:3000/api/v1/somestuff
        static async handleApiRequest(request, appId, wolfpackInterface, mongoInterface){
           
            let inputData = request.body 
            

            //save a new buy or sell order to the server 
            if(inputData.requestType == 'save_new_order'){
 
                let inputParameters = inputData.input
   
                let results = await APIHelper.saveNewOrder(inputParameters , mongoInterface)

                if(!results.success){
                    return results 
                }

                //await ApplicationManager.logNewRequest(appId,inputData.requestType,inputParameters,results, mongoInterface)

                return {success:true, input: inputParameters, output: results  }
            } 


            if(inputData.requestType == 'get_orders_for_token'){
                let inputParameters = inputData.input
   
                let results = await APIHelper.findAllOrdersByToken(inputParameters.contractAddress, inputParameters.tokenId , mongoInterface)

                return {success:true, input: inputParameters, output: results  }
            }

            if(inputData.requestType == 'get_orders_for_token_range'){
                let inputParameters = inputData.input

                console.log('meep')
   
                let results = await APIHelper.findAllOrdersByTokenRange(inputParameters.contractAddress, inputParameters.tokenIdStart, inputParameters.tokenIdEnd , mongoInterface)

                return {success:true, input: inputParameters, output: results  }
            }

            if(inputData.requestType == 'get_orders_for_account'){
                let inputParameters = inputData.input
   
                let results = await APIHelper.findAllOrdersByAccount(inputParameters.accountAddress , mongoInterface)

                return {success:true, input: inputParameters, output: results  }

            }



            // ERC 721 

            if(inputData.requestType == 'ERC721_balance_by_owner'){
 
                let inputParameters = inputData.input
 

                let results = await APIHelper.findAllERC721ByOwner(inputParameters.publicAddress , wolfpackInterface)

              
                return {success:true, input: inputParameters, output: results  }
            } 



            if(inputData.requestType == 'ERC721_balance_by_contract'){
 
                let inputParameters = inputData.input
 

                let results = await APIHelper.findAllERC721ByContract(inputParameters.contractAddress , wolfpackInterface)

              
                return {success:true, input: inputParameters, output: results  }
            }

            if(inputData.requestType == 'ERC721_by_token'){
 
                let inputParameters = inputData.input
  
                let results = await APIHelper.findAllERC721ByTokenId(inputParameters.contractAddress,inputParameters.tokenId , wolfpackInterface)

                
                return {success:true, input: inputParameters, output: results  }
            }



             
        }

        static validateOrderData(orderData){

            if(typeof orderData.chainId == 'undefined') return false; 
            if(typeof orderData.storeContractAddress == 'undefined') return false; 


            if(typeof orderData.orderCreator == 'undefined') return false; 
            if(typeof orderData.nftContractAddress == 'undefined') return false; 
            if(typeof orderData.nftTokenId == 'undefined') return false; 
            if(typeof orderData.currencyTokenAddress == 'undefined') return false; 
            if(typeof orderData.currencyTokenAmount == 'undefined') return false; 
            
            if(typeof orderData.nonce == 'undefined') return false;  
            if(typeof orderData.expires == 'undefined') return false;  
            if(typeof orderData.signature == 'undefined') return false;  

            return true
        }
             
        static async saveNewOrder( inputParameters, mongoInterface ){
            //validate the order 

            let recoveredSigner = EIP712Utils.recoverOrderSigner(  inputParameters   )

           


            let isValid = APIHelper.validateOrderData(inputParameters)

            if(!isValid){
                return { success:false, message:"invalid input parameters for order" }
            }

            let newOrderData = {
                chainId: parseInt(inputParameters.chainId),
                storeContractAddress: web3utils.toChecksumAddress(inputParameters.storeContractAddress),

                orderCreator: web3utils.toChecksumAddress(inputParameters.orderCreator),
                isSellOrder: !!inputParameters.isSellOrder,
                nftContractAddress: web3utils.toChecksumAddress(inputParameters.nftContractAddress),
                nftTokenId: parseInt(inputParameters.nftTokenId),
                currencyTokenAddress: web3utils.toChecksumAddress(inputParameters.currencyTokenAddress),
                currencyTokenAmount: parseInt(inputParameters.currencyTokenAmount),
                nonce: inputParameters.nonce.toString(),
                expires: parseInt(inputParameters.expires),
                signature: inputParameters.signature.toString()
            } 

            //check the signature for validity here 

            let signerIsValid = recoveredSigner.toLowerCase() == newOrderData.orderCreator.toLowerCase()

            if(!signerIsValid) return {success:false,  message: "Invalid signature"}
 
           

            let existingOrder = await mongoInterface.findOne('market_orders', {signature: newOrderData.signature} )
            if(existingOrder)  return {success:false,  message: "Order already saved"}

            let inserted = await mongoInterface.insertOne('market_orders',newOrderData)
            
            return {success:true,  insertion: inserted}
        }




        //   add limits 

        static async findAllOrdersByToken(contractAddress, tokenId, mongoInterface){
            contractAddress = web3utils.toChecksumAddress(contractAddress)
            tokenId = parseInt(tokenId)
            return await mongoInterface.findAll('market_orders',{nftContractAddress: contractAddress, nftTokenId:tokenId, hasBeenBurned: {$ne: true }  })
        }

        static async findAllOrdersByTokenRange(contractAddress, tokenIdMin, tokenIdMax, mongoInterface){
            contractAddress = web3utils.toChecksumAddress(contractAddress)
            tokenIdMin = parseInt(tokenIdMin)
            tokenIdMax = parseInt(tokenIdMax)
            return await mongoInterface.findAll('market_orders',{nftContractAddress: contractAddress, nftTokenId:{$gte:tokenIdMin,$lte:tokenIdMax}, hasBeenBurned:{$ne: true }  })
        } 

        static async findAllOrdersByAccount(accountAddress, mongoInterface){
            accountAddress = web3utils.toChecksumAddress(accountAddress)
            return await mongoInterface.findAll('market_orders',{accountAddress: publicAddress, hasBeenBurned:{$ne: true } })
        }


 
        static async findAllERC721ByOwner(publicAddress,mongoInterface){
            publicAddress = web3utils.toChecksumAddress(publicAddress)
            return await mongoInterface.findAll('erc721_balances',{accountAddress: publicAddress })
        }



        static async findAllERC721ByContract(contractAddress,mongoInterface){
            contractAddress = web3utils.toChecksumAddress(contractAddress)
            return await mongoInterface.findAll('erc721_balances',{contractAddress: contractAddress })
        }

        static async findAllERC721ByTokenId(contractAddress,tokenId,mongoInterface){
            contractAddress = web3utils.toChecksumAddress(contractAddress)
            return await mongoInterface.findAll('erc721_balances',{contractAddress: contractAddress, tokenIds:tokenId })
        }
       

         
    }