

import  fs   from 'fs';
import beautify from "json-beautify";

import path from 'path';

function start(){
    console.log('generate contract lookup')

    let contractDataJSON = fs.readFileSync(path.join('src/config/contractdata.json'));
    let contractData = JSON.parse(contractDataJSON)

    let outputContractsData = {}

    let networkNames = Object.keys( contractData )
    for(let network of networkNames){
        outputContractsData[network] = {} 

        for(let [key,value] of Object.entries(contractData[network].contracts)){
            let address = value.address.toLowerCase()
            let projectId = parseInt(value.projectId)

            if(isNaN(projectId))projectId=0;

            if(!outputContractsData[network][address]){
                outputContractsData[network][address] = {}
            }

            outputContractsData[network][address][projectId] = value
        }
    }
    


    let outputData = outputContractsData






    const contractLookupPath = path.join( 'src/config/generated/contractlookup.json' )

    fs.writeFile(contractLookupPath, beautify(outputData, null, 2, 100 ), (err) => {
        if (err) {
            throw err;
        }


    //      console.log('rebuilt world data in ', Date.now() - startTime, 'ms')
    });

}



start()