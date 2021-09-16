 
    import Web3Helper from './web3-helper.js'
    import BidPacketUtils from '../../src/js/bidpacket-utils.js'
    
    import FileHelper from './file-helper.js'

    import web3utils from 'web3-utils'
    import ApplicationManager from './application-manager.js'
    
 
    export default class APIHelper  {
    
        constructor(   ){
           
           
        }

        //http://localhost:3000/api/v1/somestuff
        static async handleApiRequest(request, appId, wolfpackInterface, mongoInterface){
           
            let inputData = request.body 
            

         
            if(inputData.requestType == 'ERC721_balance_by_owner'){
 
                let inputParameters = inputData.input
 

                let results = await APIHelper.findAllERC721ByOwner(inputParameters.publicAddress , wolfpackInterface)

                await ApplicationManager.logNewRequest(appId,inputData.requestType,inputParameters,results, mongoInterface)

                return {success:true, input: inputParameters, output: results  }
            } 



            if(inputData.requestType == 'ERC721_balance_by_contract'){
 
                let inputParameters = inputData.input
 

                let results = await APIHelper.findAllERC721ByContract(inputParameters.contractAddress , wolfpackInterface)

                await ApplicationManager.logNewRequest(appId,inputData.requestType,inputParameters,results, mongoInterface)

                return {success:true, input: inputParameters, output: results  }
            }

            if(inputData.requestType == 'ERC721_by_token'){
 
                let inputParameters = inputData.input
  
                let results = await APIHelper.findAllERC721ByTokenId(inputParameters.contractAddress,inputParameters.tokenId , wolfpackInterface)

                await ApplicationManager.logNewRequest(appId,inputData.requestType,inputParameters,results, mongoInterface)

                return {success:true, input: inputParameters, output: results  }
            }


            if(inputData.requestType == 'ERC20_burned_by_from'){
 
                let inputParameters = inputData.input

                let from = inputParameters.from 

                let results = await APIHelper.findBurnedERC20ByFrom(from, wolfpackInterface)

                await ApplicationManager.logNewRequest(appId,inputData.requestType,inputParameters,results, mongoInterface)

                return {success:true, input: inputParameters, output: results  }
            }

             
            if(inputData.requestType == 'ERC20_burned_by_token'){
 
                let inputParameters = inputData.input

                let token = inputParameters.token 

                let results = await APIHelper.findBurnedERC20ByToken(token, wolfpackInterface)

                await ApplicationManager.logNewRequest(appId,inputData.requestType,inputParameters,results, mongoInterface)

                return {success:true, input: inputParameters, output: results  }
            }

            if(inputData.requestType == 'ERC20_balance_by_owner'){
 
                let inputParameters = inputData.input

                let account = inputParameters.account 
                

                let results = await APIHelper.findERC20BalanceByAccount(account,  wolfpackInterface)

                await ApplicationManager.logNewRequest(appId,inputData.requestType,inputParameters,results, mongoInterface)

                return {success:true, input: inputParameters, output: results  }
            }

            if(inputData.requestType == 'ERC20_balance_by_token'){
 
                let inputParameters = inputData.input
 
                let results = await APIHelper.findERC20BalanceByToken(inputParameters.token  ,  wolfpackInterface)

                await ApplicationManager.logNewRequest(appId,inputData.requestType,inputParameters,results, mongoInterface)

                return {success:true, input: inputParameters, output: results  }
            }

            if(inputData.requestType == 'ERC20_transferred_from'){
 
                let inputParameters = inputData.input 

                let results = await APIHelper.findERC20TransferredByFrom(inputParameters.from , wolfpackInterface)

                await ApplicationManager.logNewRequest(appId,inputData.requestType,inputParameters,results, mongoInterface)

                return {success:true, input: inputParameters, output: results  }
            }

            if(inputData.requestType == 'ERC20_transferred_to'){
 
                let inputParameters = inputData.input 

                let results = await APIHelper.findERC20TransferredByTo(inputParameters.to , wolfpackInterface)

                await ApplicationManager.logNewRequest(appId,inputData.requestType,inputParameters,results, mongoInterface)

                return {success:true, input: inputParameters, output: results  }
            }

            if(inputData.requestType == 'ERC20_transferred_from_to'){
 
                let inputParameters = inputData.input 

                let results = await APIHelper.findERC20TransferredByFromTo(inputParameters.from, inputParameters.to, wolfpackInterface)

                await ApplicationManager.logNewRequest(appId,inputData.requestType,inputParameters,results, mongoInterface)

                return {success:true, input: inputParameters, output: results  }
            }




             //Name Deprecated
            if(inputData.requestType == 'burned_ERC20_by_from'){
 
                let inputParameters = inputData.input

                let from = inputParameters.from 

                let results = await APIHelper.findBurnedERC20ByFrom(from, wolfpackInterface)

                await ApplicationManager.logNewRequest(appId,inputData.requestType,inputParameters,results, mongoInterface)

                return {success:true, input: inputParameters, output: results  }
            }

             //Name Deprecated
            if(inputData.requestType == 'burned_ERC20_by_token'){
 
                let inputParameters = inputData.input

                let token = inputParameters.token 

                let results = await APIHelper.findBurnedERC20ByToken(token, wolfpackInterface)

                await ApplicationManager.logNewRequest(appId,inputData.requestType,inputParameters,results, mongoInterface)

                return {success:true, input: inputParameters, output: results  }
            }



               //Name Deprecated
               if(inputData.requestType == 'all_ERC721'){
 
                let inputParameters = inputData.input

                let publicAddress = inputParameters.publicAddress 

                

                let results = await APIHelper.findAllERC721ByOwner(publicAddress, wolfpackInterface)

                await ApplicationManager.logNewRequest(appId,inputData.requestType,inputParameters,results, mongoInterface)

                return {success:true, input: inputParameters, output: results  }
            } 



            return {success:false}
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



        static async findBurnedERC20ByFrom(publicAddress,mongoInterface){
            publicAddress = web3utils.toChecksumAddress(publicAddress)
            return await mongoInterface.findAll('erc20_burned',{from: publicAddress })
        }

        static async findBurnedERC20ByToken(tokenAddress,mongoInterface){
            tokenAddress = web3utils.toChecksumAddress(tokenAddress)
            return await mongoInterface.findAll('erc20_burned',{token: tokenAddress })
        }

        

        //TEST THESE 
        static async findERC20BalanceByAccount(accountAddress, mongoInterface){
            accountAddress = web3utils.toChecksumAddress(accountAddress) 
            return await mongoInterface.findAll('erc20_balances',{accountAddress: accountAddress  })
        }

        static async findERC20BalanceByToken(tokenAddress,mongoInterface){
            tokenAddress = web3utils.toChecksumAddress(tokenAddress)
            return await mongoInterface.findAll('erc20_balances',{contractAddress: tokenAddress })
        }


        //IMPLEMENT THESE 

     /*   static async findERC20TransferredByToken(tokenAddress,mongoInterface){
            tokenAddress = web3utils.toChecksumAddress(tokenAddress)
            return await mongoInterface.findAll('erc20_transferred',{token: tokenAddress })
        }*/

        static async findERC20TransferredByFrom(from,mongoInterface){
            from = web3utils.toChecksumAddress(from)
            return await mongoInterface.findAll('erc20_transferred',{from: from })
        }

        static async findERC20TransferredByTo(to,mongoInterface){
            to = web3utils.toChecksumAddress(to)
            return await mongoInterface.findAll('erc20_transferred',{to: to })
        }

        static async findERC20TransferredByFromTo(from,to,mongoInterface){
            from = web3utils.toChecksumAddress(from)
            to = web3utils.toChecksumAddress(to)
            return await mongoInterface.findAll('erc20_transferred',{from: from, to:to })
        }

         
    }