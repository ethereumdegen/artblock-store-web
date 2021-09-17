
 

import MongoInterface from './mongo-interface.js'


    export default class WolfpackInterface  {
    
        constructor( dbName ){
          
            this.mongoInterface = new MongoInterface(  dbName  ) 
           
        }

        
        getMongo( ){
             

            return this.mongoInterface 
        }


    
         
    }