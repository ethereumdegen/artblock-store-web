


 
import web3 from 'web3'

export default class IndexerTellerOptions{

    static async modifyLedgerByEvent(event,mongoInterface){ 
  
        let eventName = event.event   

        let outputs = event.returnValues
        
        

        if(!eventName){
 
            console.log('WARN: unknown event in ', event.transactionHash )
            return
        }
 
        eventName = eventName.toLowerCase() 

        
        if(eventName == 'optioncreated'){
            let optionId =  parseInt(outputs['0'])
            let creator = web3.utils.toChecksumAddress( outputs['1'] )
            
            
            await IndexerTellerOptions.optionCreated( optionId, creator,  mongoInterface )
             
        }
         
        if(eventName == 'optionfilled'){
 
            let optionId =   parseInt(outputs['0'])
  
            await IndexerTellerOptions.setOptionStatus(optionId, 'filled', mongoInterface )
             
        }
           
        if(eventName == 'optionexercised'){
 
            let optionId =   parseInt(outputs['0'])
  
            await IndexerTellerOptions.setOptionStatus(optionId, 'exercised', mongoInterface )
             
        }
         
        if(eventName == 'optioncancelled'){
 
            let optionId =   parseInt(outputs['0'])
  
            await IndexerTellerOptions.setOptionStatus(optionId, 'cancelled', mongoInterface )
             
        }
        if(eventName == 'optionexpired'){
 
            let optionId =   parseInt(outputs['0'])
  
            await IndexerTellerOptions.setOptionStatus(optionId, 'expired', mongoInterface )
             
        }
         

    }
 

   static async setOptionStatus(optionId, newStatus, mongoInterface){

       let collectionName = 'teller_options' 

       let existing = await mongoInterface.findOne(collectionName, {optionId: optionId }  )

       if(existing){            
           await mongoInterface.updateOne(collectionName, {optionId: optionId}, {status: newStatus }   )
       }
   }

   
   static async optionCreated( optionId, creator, mongoInterface ){

    let collectionName = 'teller_options'    
    
    let existing = await mongoInterface.findOne(collectionName, {optionId: optionId }  )

    if(!existing){ 
      
        await mongoInterface.insertOne(collectionName, { creator:creator, optionId: optionId , status:'created'}   )
    }
}



}