
 

import MongoInterface from './mongo-interface.js'


    export default class WolfpackInterface  {
    
        constructor( envmode ){
            console.log('connect to ', 'wolfpack_'.concat(envmode)  )
            this.mongoInterface = new MongoInterface( 'wolfpack_'.concat(envmode) ) 
           
        }

        
        getMongo( ){
             

            return this.mongoInterface 
        }


    
         
    }