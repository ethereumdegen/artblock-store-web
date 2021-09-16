
 
import axios from "axios";


export default class StarflaskAPIHelper {


  static async resolveStarflaskQuery(uri, inputData){

    return new Promise(   (resolve, reject) => {

      axios.post(uri, inputData )
      .then((res) => {
         
           console.log(res.data)
           let results = res.data
          
     
            resolve(results)

       }) .catch((error) => {
           console.error(error)
           reject(error)
       })

   }); 

  }
 
 




}