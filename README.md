# BUY THE FLOOR 
 
Web frontend for Demand Based NFT Exchange
 


IMPROVE LATER: 
- build subgraphs for wrapped mooncats and wrapped punks that give orig ids and wrap ids  !!! Per owner .


- Use wolfpack to store event data about BTF burn events 
- Use Starflask API to show sellers a page of all of their NFTs (so they dont have to pick by type )


### TODO
 -FOR VERSION 2
 Need to deploy the version 2 contract on mainnet  [DONE]
 need to setup alchemy 
 need to sync data from alchemy 
 

 -set up proxy in nginx , port 3000 for api (api.buythefloor.com) using HTTPs certs 


-run server with pm2 
 

 

3) build subgraphs to be able to show users items on website 

4) make it easier to wrap things - wrapping on the site 
 
 5) make a page that simply shows a user all of the NFTS (api input is their address output is their NFTs!)

 -API 
  



### Development commands
```
npm install
npm run dev
```

### Packaging commands
```
npm run build
npm run server
```


## using pm2

 pm2 start pm2.config.json --env production 
pm2 monit 