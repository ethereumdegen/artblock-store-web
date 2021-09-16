 
    import Web3Helper from './web3-helper.js'
    import BidPacketUtils from '../../src/js/bidpacket-utils.js'

    import BigNumber from 'bignumber.js' 

    import web3utils from 'web3-utils'
    
    import FileHelper from './file-helper.js'
 
    
    let envmode = process.env.NODE_ENV

    let wolfpackConfigFile = FileHelper.readJSONFile('./market-api-server/dataghostconfig.json')
    let wolfpackConfig = wolfpackConfigFile[envmode].wolfPackConfig

 
    export default class APIHelper  {
    
        constructor(   ){
           
           
        }

        //http://localhost:3000/api/v1/somestuff
        static async handleApiRequest(type,request, mongoInterface, wolfpackInterface){
            console.log('got api request', request.params )

            if(!type){
                if(request.params['query'].toLowerCase() == 'overview' ){


                    return await APIHelper.getOverview(mongoInterface,wolfpackInterface)
                }

                if(request.params['query'].toLowerCase() == 'recentsales' ){ 

                    return await APIHelper.getRecentSales( wolfpackInterface)
                }

            }

            if(type == 'userbids'){

                return await APIHelper.getActiveBidsOfUser(request.params['useraddress'],mongoInterface)
            }
           

            return 'This is the API'
        }

        static async getOverview(mongoInterface,wolfpackInterface){

            let networkData = await mongoInterface.findOne('network_data')



            let response = {success:true, tokens:[], network: networkData}

            for(let token of wolfpackConfig.contracts ){  
                let address = web3utils.toChecksumAddress( token.address ) 

                console.log('address',address)

                
                let tokenData = await wolfpackInterface.getMongo().findOne('contract_state',{contractAddress: address })

                console.log('tokenData',tokenData)
                response.tokens.push(tokenData)
            }

            return response
        }



        static async getRecentSales( wolfpackInterface){


            let salesArray = await wolfpackInterface.getMongo().findAllSortedWithLimit('nft_sale',{  }, {}, 100 )

            return {recentSales: salesArray}

             
        }


        static async getActiveBidsOfUser(userAddress, mongoInterface){

            userAddress = userAddress.toLowerCase()

            let bidsArray = await mongoInterface.findAllSortedWithLimit('bidpackets',{bidderAddress: userAddress }, {}, 500 )

            return {bids: bidsArray}
        }
        
        static async getDataForToken(tokenAddress, wolfpackInterface ){

            tokenAddress = web3utils.toChecksumAddress(tokenAddress)

            let tokenData = await wolfpackInterface.getMongo().findOne('contract_state',{contractAddress: tokenAddress })

            return tokenData
        }

        static async getUserBalanceApprovalForToken(userAddress, tokenAddress, spenderAddress, wolfpackInterface ){

            tokenAddress = web3utils.toChecksumAddress(tokenAddress)
            userAddress = web3utils.toChecksumAddress(userAddress)
            spenderAddress = web3utils.toChecksumAddress(spenderAddress)

            //console.log('find approve', {contractAddress: tokenAddress, ownerAddress: userAddress , spenderAddress:  spenderAddress })
            let balanceData = await wolfpackInterface.getMongo().findOne('erc20_balances',{contractAddress: tokenAddress, accountAddress: userAddress })
            let approvedData = await wolfpackInterface.getMongo().findOne('erc20_approval',{contractAddress: tokenAddress, ownerAddress: userAddress , spenderAddress:  spenderAddress })

            let results = {balance:0, approved: 0}

            if(balanceData){
                results.balance = new BigNumber(balanceData.amount)
            }
            if(approvedData){
                results.approved = new BigNumber(approvedData.amount)
            }


            return results
        }


        static async getSignatureIsBurned(packetHash, wolfpackInterface ){

            //tokenAddress = web3utils.toChecksumAddress(tokenAddress)

            let signatureData = await wolfpackInterface.getMongo().findOne('offchain_signatures',{hash: packetHash })

            if(signatureData){
                console.log('found burn status', signatureData)

                return signatureData.burned 
            }

            return false 
       }
            

    
         
    }