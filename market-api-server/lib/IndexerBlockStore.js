


 
import web3 from 'web3'

export default class IndexerBlockStore{

    static async modifyLedgerByEvent(event,mongoInterface){ 
  
        let eventName = event.event   

        let outputs = event.returnValues
        
        

        if(!eventName){
 
            console.log('WARN: unknown event in ', event.transactionHash )
            return
        }
 
        eventName = eventName.toLowerCase() 


        if(eventName == 'nftsale'){
            
            let sellerAddress = web3.utils.toChecksumAddress( outputs['0'] )
            
            let buyerAddress = web3.utils.toChecksumAddress( outputs['1'] )
            
            let nftContractAddress = web3.utils.toChecksumAddress( outputs['2'] )
            
            let nftTokenId = parseInt( outputs['3'] )
            let currencyTokenAddress = web3.utils.toChecksumAddress( outputs['4'] )
            
            let currencyTokenAmount = web3.utils.toChecksumAddress( outputs['5'] )
             
            
            await IndexerBlockStore.nftSale( sellerAddress, buyerAddress, nftContractAddress, nftTokenId, currencyTokenAddress, currencyTokenAmount, mongoInterface )
             
        }
        
        if(eventName == 'nonceburned'){
            
            let creator = web3.utils.toChecksumAddress( outputs['0'] )
            let nonce = ( outputs['1'] )
            
            
            await IndexerBlockStore.nonceBurned( creator, nonce, mongoInterface )
             
        }
         
       

    }
 

   static async nonceBurned(orderCreator, nonce, mongoInterface){

       let collectionName = 'burned_nonces' 

       let existing = await mongoInterface.findOne(collectionName, {orderCreator: orderCreator, nonce:nonce }  )

       if(existing){            
           await mongoInterface.insertOne(collectionName, {orderCreator: orderCreator, nonce:nonce }   )
       }
   }


   static async nftSale( sellerAddress, buyerAddress, nftContractAddress, nftTokenId, currencyTokenAddress, currencyTokenAmount, mongoInterface){

    let collectionName = 'nft_sale' 

            
    await mongoInterface.insertOne(collectionName, {  sellerAddress:sellerAddress, buyerAddress:buyerAddress, nftContractAddress:nftContractAddress, nftTokenId:nftTokenId, currencyTokenAddress:currencyTokenAddress, currencyTokenAmount:currencyTokenAmount }   )
    
}

   
   



}